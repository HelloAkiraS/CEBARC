import sys
import json
import math



def calc_ag(p: dict) -> float:
    return (p['tf'] * p['bf'] * 2) + (p['h'] * p['tw'])


def calc_ly(p: dict) -> float:
    return ((p['tf'] * p['bf'] ** 3) / 12) * 2 \
         + ((p['h'] * p['tw'] ** 3) / 12)


def calc_r(ly: float, ag: float) -> float:
    return math.sqrt(ly / ag)


def calc_ec(p: dict) -> float:
    bf, tf, tw, h = p['bf'], p['tf'], p['tw'], p['h']
    npa = p.get('npa', 0)
    dp  = p.get('dp', 0)
    numerador = (
        (((bf / 4) * ((bf / 2) * tf)) * 2) +
        ((tw / 4) * ((h * (tw / 2)) - (npa * dp * tw)))
    )
    denominador = (
        (((bf / 2) * tf) * 2) +
        ((h * (tw / 2)) - (npa * dp * tw))
    )
    return numerador / denominador


def calc_esb(ag: float, fy: float, ya1: float) -> float:
    return (ag * fy) / ya1


def calc_rsle(ae: float, fu: float, ya2: float) -> float:
    return (ae * fu) / ya2


def calc_ad(broca) -> float:
    return 0.15 if broca else 0.35


def calc_es(p: dict) -> float:
    return p['tw'] if p['alma'] else p['tf']


def calc_af(p: dict) -> float:
    ad = calc_ad(p.get('broca'))
    es = calc_es(p)
    return p['npa'] * (p['dp'] + ad) * es


def calc_an(p: dict, ag: float) -> float:
    if not p['parafuso']:
        return ag

    af = calc_af(p)
    s, g, npa = p['s'], p['g'], p['npa']

    if g == 0:
        return ag - af

    return ag - af + ((s ** 2 / (4 * g)) * npa)


def calc_ct(p: dict, ag: float, ec: float) -> float:
    caso = p['caracteristicasDeLigacao']

    if caso == 1:
        return 1.0

    if caso == 2:
        return p['ac'] / ag

    if caso == 3:
        return 1 - (ec / p['lc'])

    if caso == 4:
        numerador = 3 * (p['lc'] ** 2)
        denominador = numerador + (p['b'] ** 2)
        return (numerador / denominador) * (1 - (p['t'] / 2 * p['Lc']))

    if caso in (5, 6):
        return (1 + ((p['ec'] / p['lc']) ** (3.2))) ** (-10)

    return 0.0


def calc_els(L: float, r: float) -> float:
    return L / r


def _executar(p: dict) -> dict:
    ag   = calc_ag(p)
    ly   = calc_ly(p)
    r    = calc_r(ly, ag)
    ec   = calc_ec(p)
    an   = calc_an(p, ag)
    ct   = calc_ct(p, ag, ec)
    ae   = ct * an
    esb  = calc_esb(ag, p['fy'], p['ya1'])
    rsle = calc_rsle(ae, p['fu'], p['ya2'])
    elu  = min(esb, rsle)
    els  = calc_els(p['L'], r)

    return { 'ELU': elu, 'ELS': els }

def calc_perda(t: float, resistente: bool) -> float:
    if t == 0:
        return 0.0
    try:
        return ((0.07 * math.log(t) + 0.0213) / 10) if resistente \
            else ((0.2538 * math.log(t) + 0.0202) / 10)
    except ValueError:
        return 0.0

def calculadora(p: dict) -> dict:
    t0 = _executar(p)

    perda = calc_perda(p['t'], p['resistente'])
    p_corroido = {
        **p,
        'tw': p['tw'] - (2 * perda),
        'tf': p['tf'] - (2 * perda),
    }
    tN = _executar(p_corroido)
    delta             = t0['ELU'] - tN['ELU']
    delta_porcentagem = (delta / t0['ELU']) * 100 if t0['ELU'] != 0 else 0.0

    return { 't0': t0, 'tN': tN, 'delta': delta, 'delta_porcentagem': delta_porcentagem}


if __name__ == '__main__':
    params = json.loads(sys.stdin.read())
    resultado = calculadora(params)
    print(json.dumps(resultado))