import prompts, { type PromptObject } from 'prompts';
import { type IRespostas } from '../src/types';
import { validarNumeroPositivo, validarNumeroNaoNegativo } from '../src/functions';

export async function executarWizard(): Promise<IRespostas> {
   
    let altb: number = 0;
    let tipoLigacao: number = 0;
    let usaParafuso: boolean = true;

    console.log("\n👷 Bem-vindo à Calculadora! 👷\n")
    console.log("Insira os valores:\n");

    const perguntas: PromptObject[] = [
        {
            type: 'text',
            name: 't',
            message: 'Tempo de corrosão (Anos)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'toggle',
            name: 'resistente',
            message: 'Perfil é resistente a corrosão?',
            initial: true,
            active: 'Sim',
            inactive: 'Não'
        },
        {
            type: 'text',
            name: 'ya1',
            message: 'Gama a1',
            validate: validarNumeroPositivo,
            initial: '1,1',
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'text',
            name: 'ya2',
            message: 'Gama a2',
            validate: validarNumeroPositivo,
            initial: '1,35',
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'text',
            name: 'fy',
            message: 'Tensão de Escoamento (KN/cm²)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'text',
            name: 'fu',
            message: 'Tensão última (KN/cm²)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'text',
            name: 'L',
            message: 'Comprimento da Barra (cm)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'select',
            name: 'caracteristicasDeLigacao',
            message: 'Escolha a característica de ligação:',
            choices: [
                {
                    title: 'a',
                    value: 1,
                    description: 'Descrição respectiva'
                },
                {
                    title: 'b',
                    value: 2,
                    description: 'Descrição respectiva'
                },
                {
                    title: 'c',
                    value: 3,
                    description: 'Descrição respectiva'
                },
                {
                    title: 'd',
                    value: 4,
                    description: 'Descrição respectiva'
                },
                {
                    title: 'e',
                    value: 5,
                    description: 'Descrição respectiva'
                },
                {
                    title: 'f',
                    value: 6,
                    description: 'Descrição respectiva'
                }
            ],
            hint: '- Use as setas para navegar e Enter para confirmar',
            onState: state => { if(state.value !== undefined) tipoLigacao = state.value }
        },
        {
            type: () => tipoLigacao === 4 ? 'text' : null,
            name: 'Ac',
            message: 'Área da seção transversal dos elementos conectados (cm)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: () => tipoLigacao === 4 ? 'text' : null,
            name: 'b',
            message: 'Largura da chapa (cm)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',', '.')),
            onState: (state) => { if (state.value !== undefined) altb = Number(state.value.toString().replace(',', '.')) }
        },
        {
            type: () => tipoLigacao === 4 ? 'text' : null,
            name: 'Lw',
            message: 'Comprimento dos cordões de solda (cm)',
            validate: (lw) => {
                const lwNumerico = Number(lw.replace(',', '.'));

                if (isNaN(lwNumerico) || lw.trim() === '') {
                    return 'Por favor, insira um valor numérico válido.';
                }
                if (lwNumerico < altb) {
                    return `Erro: O comprimento (Lw) não pode ser menor que o valor de b (${altb} cm).`;
                }

                return true;
            },
            format: input => Number(input.replace(',', '.'))
        },
        {
            type: () => tipoLigacao === 4 ? 'text' : null,
            name: 'DExt',
            message: 'Diâmetro externo da barra (cm)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.')) 
        },
        {
            type: 'toggle',
            name: 'parafuso',
            message: 'Ligação usa parafuso ou solda?',
            initial: true,
            active: 'Parafuso',
            inactive: 'Solda',
            onState: state => { if (state.value !== undefined) usaParafuso = state.value }
        },
        {
            type: prev => prev === true ? 'toggle' : null,
            name: 'broca',
            message: 'Usa broca?',
            initial: true,
            active: 'Sim',
            inactive: 'Não'
        },
        {
            type: () => usaParafuso ? 'text' : null,
            name: 'dp',
            message: 'Diâmetro dos parafusos (cm)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: () => usaParafuso ? 'text' : null,
            name: 'npa',
            message: 'Número de parafusos alinhados para análise',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: () => usaParafuso ? 'text' : null,
            name: 'nlpd',
            message: 'Número de linhas de parafusos em diagonal',
            validate: validarNumeroNaoNegativo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: () => usaParafuso ? 'text' : null,
            name: 's',
            message: 'Espaçamento longitudinal dos parafusos (cm)',
            validate: validarNumeroNaoNegativo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: () => usaParafuso ? 'text' : null,
            name: 'g',
            message: 'Espaçamento transversal dos parafusos (cm)',
            validate: validarNumeroNaoNegativo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'text',
            name: 'tw',
            message: 'Espessura da alma (cm)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'text',
            name: 'tf',
            message: 'Espessura da mesa (cm)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'toggle',
            name: 'alma',
            message: 'Ligação ocorre na alma ou mesa?',
            initial: true,
            active: 'Alma',
            inactive: 'Mesa'
        },
        {
            type: 'text',
            name: 'bf',
            message: 'Largura da mesa (cm)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'text',
            name: 'h',
            message: 'Altura interna da alma (cm)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        },
        {
            type: 'text',
            name: 'lc',
            message: 'Comprimento efetivo da ligação na direção da força axial (cm)',
            validate: validarNumeroPositivo,
            format: input => Number(input.replace(',','.'))
        }
    ]

    const respostas = await prompts(perguntas) as IRespostas

    return respostas

}