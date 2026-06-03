import { executarWizard } from './wizard';

const parametros = await executarWizard();

const python = process.platform === 'win32' ? 'python' : 'python3';

const proc = Bun.spawn([python, 'python/algorithm.py'], {
    stdin: 'pipe',
    stdout: 'pipe',
    stderr: 'inherit',
});

proc.stdin.write(JSON.stringify(parametros));
proc.stdin.end();

const output = await new Response(proc.stdout).text();
const resultado = JSON.parse(output);

console.log('\n📊 Resultado:\n');
console.log(`  ELU (Força axial resistente de cálculo): ${resultado.ELU.toFixed(2)} kN`);
console.log(`  ELS (Verificação de esbeltez):           ${resultado.ELS.toFixed(2)}`);

if (resultado.ELS > 300) {
    console.log('\n  ⚠️  Atenção: ELS excede o limite de 300.');
}

console.log('');