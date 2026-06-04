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
const { t0, tN, delta, delta_porcentagem } = JSON.parse(output);

const linha = '─'.repeat(52);

console.log(`\n📊 Resultado:\n`);

console.log(`   ${linha}`);
console.log(`   Sem corrosão (t = 0)`);
console.log(`   ${linha}`);
console.log(`   ELU:  ${t0.ELU.toFixed(2)} kN`);
console.log(`   ELS:  ${t0.ELS.toFixed(2)}`);
if (t0.ELS > 300) console.log(`  ⚠️  ELS excede o limite de 300.`);

console.log(`   ${linha}`);
console.log(`   Com corrosão (t = ${parametros.t} anos)`);
console.log(`   ${linha}`);
console.log(`   ELU:  ${tN.ELU.toFixed(2)} kN`);
console.log(`   ELS:  ${tN.ELS.toFixed(2)}`);
if (tN.ELS > 300) console.log(`  ⚠️  ELS excede o limite de 300.`);

console.log(`\n   ${linha}`);
console.log(`   Variação do ELU`);
console.log(`   ${linha}`);
console.log(`   Δ  ELU:  ${delta.toFixed(2)} kN`);
console.log(`   Δ% ELU:  ${delta_porcentagem.toFixed(2)} %`);

console.log('');