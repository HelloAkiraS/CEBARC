export interface IRespostas {
    t: number, // Tempo de corrosão (Anos)
    resistente: boolean, // Perfil é resistente?
    ya1: number, // Gama a1
    ya2: number, // Gama a2
    fy: number, // Tensão de Escoamento (KN/cm²)
    fu: number, // Tensão última (KN/cm²)
    L: number, // Comprimento da Barra (cm)
    caracteristicasDeLigacao: 1 | 2 | 3 | 4 | 5 | 6, // Diferentes casos de ligação
    parafuso: boolean, // Ligacao usa parafuso? True = parafuso; False = solda
    broca: boolean | null, //
    alma: boolean, // Ligacao ocorre na alma? True = alma; False = mesa
    tw: number, // Espessura da alma (cm)
    tf: number, // Espessura da mesa (cm)
    bf: number, // Largura da mesa (cm)
    h: number, // Altura interna da alma (cm)
    lc: number, // Comprimento efetivo da ligação na direção da força axial (cm)
    Ac: number | null, // Área da seção transversal dos elementos conectados (cm)
    Lw: number | null, // Comprimento dos cordões de solda (não pode ser menor que b) (cm)
    b: number | null, // Largura da chapa (cm)
    Dext: number | null, // Diâmetro externo da barra (cm)
    dp: number, // Diâmetro dos parafusos (cm)
    npa: number, // Número de parafusos alinhados para análise 
    nlpd: number, // Número de linhas de parafusos em diagonal
    s: number, // Espaçamento longitudinal dos parafusos (cm)
    g: number, // Espaçamento transversal dos parafusos (cm)
}

export type IParams = Omit<IRespostas, 't'> & Omit<IRespostas, 'resistente'>;

export interface IResultado {
    ELU: number, // FORÇA AXIAL RESISTENTE DE CÁLCULO - ELU
    ELS: number, // VERIFICAÇÃO DA ESBELTEZ (deve ser <= 300)
}