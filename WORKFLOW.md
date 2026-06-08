# Fluxo de Execução (CEBARC)

Este documento descreve a sequência exata de operações que o CEBARC realiza para calcular o ELU, ELS e a perda de resistência devido à corrosão, garantindo rastreabilidade total para fins de reprodutibilidade científica.

## Sequência de Execução

1. **Entrada de Parâmetros (CLI)**
   - O usuário executa a aplicação CLI.
   - O arquivo `src/wizard.ts` coleta todos os parâmetros (tempo de corrosão, tensões, dimensões, etc.) via prompts interativos.

2. **Passagem de Parâmetros para Python**
   - Em `src/index.ts`, a aplicação serializa os dados do usuário para o formato JSON.
   - O Node/Bun inicia um processo filho para executar o `python/algorithm.py`, enviando os dados JSON via *stdin*.

3. **Cálculos Matemáticos (`algorithm.py`)**
   O Python processa os dados, primeiro calculando as condições sem corrosão (tempo = 0), e depois aplicando o modelo de corrosão para recalcular.
   - **3a.** Calcula a área geométrica (`ag`).
   - **3b.** Calcula o momento de inércia (`ly`).
   - **3c.** Calcula o raio de giração (`r`), o coeficiente `ec` e a área líquida (`an`).
   - **3d.** Obtém o `ELU` avaliando o menor valor entre o escoamento bruto (`esb`) e a ruptura da seção líquida efetiva (`rsle`).
   - **3e.** Calcula o `ELS`.
   - **3f.** Aplica o modelo de corrosão logarítmico. Baseado na variável `resistente` (se é um perfil resistente ou não), ele subtrai a perda (`perda`) da espessura da mesa (`tf`) e da alma (`tw`).
   - **3g.** Repete os passos 3a a 3e com os valores corroídos para achar o novo `ELU` e `ELS`.
   - **3h.** Retorna os valores e as variáveis intermediárias formatados em JSON via *stdout*.

4. **Gravação e Apresentação**
   - O `index.ts` intercepta o JSON resultante do Python.
   - Os resultados são apresentados no console.
   - O relatório completo (contendo metadados, *input*, e *output* com os valores intermediários) é salvo em disco no diretório `results/` com um *timestamp* único para garantir que análises anteriores não sejam sobrescritas.

## Fórmulas Principais

- **Escoamento (ELU)**: `ESB = (Ag * Fy) / Ya1`
- **Ruptura (ELU)**: `RSLE = (Ae * Fu) / Ya2`
- **Estado Limite de Serviço (ELS)**: `ELS = L / r`
- **Área Efetiva (Ae)**: `Ae = Ct * An`

### Modelo de Corrosão de e(t):
A perda de espessura de corrosão ao longo do tempo `t` é dada por:

- Para aço **resistente** à corrosão:
  `perda = (0.07 * ln(t) + 0.0213) / 10`

- Para aço **não resistente** à corrosão:
  `perda = (0.2538 * ln(t) + 0.0202) / 10`

*(Os valores acima são aplicados para reduzir a espessura da mesa e da alma)*

## Exemplo de Execução Completa

**Input:**
```json
{
    "t": 10,
    "resistente": false,
    "ya1": 1.1,
    "ya2": 1.35,
    "fy": 25.0,
    "fu": 40.0,
    "L": 300,
    "parafuso": true,
    "broca": true,
    "alma": true,
    "tw": 1.0,
    "tf": 1.5,
    "bf": 15.0,
    "h": 30.0,
    "lc": 10.0,
    "dp": 1.6,
    "npa": 2,
    "nlpd": 0,
    "s": 0,
    "g": 0
}
```

**Output Parcial:**
```json
{
    "ELU": 1215.111111111111,
    "ELS": 54.497706373766794,
    "intermediaries": {
        "ag": 75.0,
        "ly": 2269.1666666666665,
        "r": 5.500505128318625,
        "ec": 1.7647058823529411,
        "ae": 41.00999999999999,
        "esb": 1704.5454545454545,
        "rsle": 1215.111111111111
    }
}
```
*(Confira a pasta `examples/` para visualizar os casos de testes documentados integralmente)*
