export interface IRespostas {
    t: number, // Tempo de corrosão (Anos)
    resistente: boolean, // Perfil é resistente?
    ya1: number, // Gama a1
    ya2: number, // Gama a2
    fy: number, // Tensão de Escoamento (KN/cm²)
    fu: number, // Tensão última (KN/cm²)
    L: number, // Comprimento da Barra (cm)

    parafuso: boolean, // Ligacao usa parafuso? True = parafuso; False = solda
    broca: boolean | null, //
    alma: boolean, // Ligacao ocorre na alma? True = alma; False = mesa
    tw: number, // Espessura da alma (cm)
    tf: number, // Espessura da mesa (cm)
    bf: number, // Largura da mesa (cm)
    h: number, // Altura interna da alma (cm)
    lc: number, // Comprimento efetivo da ligação na direção da força axial (cm)

    tc: number | null, // Espessura da chapa (cm)
    hc: number | null, // Altura da chapa

    dp: number, // Diâmetro dos parafusos (cm)
    npa: number, // Número de parafusos alinhados para análise 
    nlpd: number, // Número de linhas de parafusos em diagonal
    s: number, // Espaçamento longitudinal dos parafusos (cm)
    g: number, // Espaçamento transversal dos parafusos (cm)
}