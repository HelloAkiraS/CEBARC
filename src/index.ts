import { executarWizard } from './wizard';
import path from 'path';
import pkg from '../package.json';
import prompts from 'prompts';

async function getPythonVersion(python: string): Promise<string> {
    try {
        const proc = Bun.spawn([python, '--version'], { stdout: 'pipe' });
        const text = await new Response(proc.stdout).text();
        return text.trim();
    } catch {
        return 'Desconhecida';
    }
}

const python = process.platform === 'win32' ? 'python' : 'python3';

console.log("═══════════════════════════════════");
console.log(`CEBARC v${pkg.version}`);
console.log(`Data/hora: ${new Date().toISOString()}`);
console.log(`Bun: ${Bun.version}`);
console.log(`Python: ${await getPythonVersion(python)}`);
console.log("═══════════════════════════════════");

let continuar = true;

while (continuar) {
    const parametros = await executarWizard();

    const scriptPath = path.join(process.cwd(), 'python/algorithm.py');

    const proc = Bun.spawn([python, scriptPath], {
        stdin: 'pipe',
        stdout: 'pipe',
        stderr: 'inherit',
    });

    proc.stdin.write(JSON.stringify(parametros));
    proc.stdin.end();

    const output = await new Response(proc.stdout).text();
    let resultado;
    try {
        // Extrai apenas a parte que é JSON da saída para evitar erros caso o Python imprima avisos (warnings) antes.
        const jsonStart = output.indexOf('{');
        const jsonEnd = output.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error("Nenhum JSON encontrado na saída.");
        }
        resultado = JSON.parse(output.substring(jsonStart, jsonEnd + 1));
    } catch (error) {
        console.error("Erro ao analisar a saída do Python. Saída recebida:", output);
        process.exit(1);
    }
    const { t0, tN, delta, delta_porcentagem } = resultado;

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

    // Save JSON results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalOutput = {
        metadata: {
            timestamp,
            bun_version: Bun.version,
            input_file: "stdin"
        },
        input: parametros,
        summary: {
            delta: resultado.delta,
            delta_percent: resultado.delta_porcentagem,
            verdict: resultado.delta > 0 ? "resistência reduzida" : "sem perda"
        },
        detailed: {
            without_corrosion: {
                ELU: resultado.t0.ELU,
                ELS: resultado.t0.ELS,
                intermediaries: resultado.t0.intermediaries
            },
            with_corrosion: {
                ELU: resultado.tN.ELU,
                ELS: resultado.tN.ELS,
                intermediaries: resultado.tN.intermediaries
            }
        }
    };

    await Bun.write(
        `results/analysis_${timestamp}.json`,
        JSON.stringify(finalOutput, null, 2)
    );

    console.log(`\nResultados salvos em: results/analysis_${timestamp}.json\n`);

    const resposta = await prompts({
        type: 'confirm',
        name: 'novoCalculo',
        message: 'Deseja realizar um novo cálculo?',
        initial: false
    });

    continuar = resposta.novoCalculo;
    if (continuar) {
        console.log("\n" + "═══════════════════════════════════" + "\n");
    }
}

console.log("Programa encerrado.");