export const validarNumeroPositivo = (inputUsuario: string) => {
    if (inputUsuario.trim() === '') return 'Entrada obrigatória! Por favor, não deixe o campo vazio.';

    const valorNumerico = Number(inputUsuario.replace(',', '.'));

    if (isNaN(valorNumerico)) return 'Formato inválido! Por favor, digite apenas números.';

    if (valorNumerico <= 0) return 'O valor deve ser maior que zero.';
    
    return true;
}

export const validarNumeroNaoNegativo = (inputUsuario: string) => {
    if (inputUsuario.trim() === '') return 'Entrada obrigatória! Por favor, não deixe o campo vazio.';

    const valorNumerico = Number(inputUsuario.replace(',', '.'));

    if (isNaN(valorNumerico)) return 'Formato inválido! Por favor, digite apenas números.';

    if (valorNumerico < 0) return 'O valor não pode ser negativo.';
    
    return true;
}