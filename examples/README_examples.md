# Exemplos de Validação

Esta pasta contém dados reais validados do projeto CEBARC. Eles servem para garantir a reprodutibilidade dos resultados em qualquer ambiente.

## Como utilizar

Para validar se o seu ambiente está produzindo os resultados corretos:

1. Rode o script do algoritmo passando um dos arquivos de entrada:
```bash
# Exemplo usando PowerShell no Windows
Get-Content examples/example_1_input.json | python python/algorithm.py

# Exemplo usando Bash no Linux/Mac
python3 python/algorithm.py < examples/example_1_input.json
```

2. Compare a saída gerada pelo comando acima com o conteúdo do arquivo `example_1_output.json`. Os valores de `ELU`, `ELS`, `delta`, e as variáveis intermediárias (`ag`, `ly`, etc.) devem ser idênticos.

Repita o processo para os outros exemplos caso queira validar cenários diferentes (como solda vs. parafuso, ou perfis resistentes vs. não-resistentes).
