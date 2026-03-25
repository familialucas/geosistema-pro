// 1. Redutor de Peso para evitar erro de Memória
function comprimirImagem(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
        };
    });
}

// 2. Processamento Único
async function processarVistoriaAtual(formElement) {
    const formData = new FormData(formElement);

    const vistoria = {
        fotosAdicionais: [],
        servico:         [],
        apontamento:     [],  // recuos, área de risco
        dependencia:     []   // fundo bíblico, EBI, secretaria, etc.
    };

    const promises = [];

    for (let [key, value] of formData.entries()) {
        if (key === 'servico') {
            vistoria.servico.push(value);
        } else if (key === 'apontamento') {
            vistoria.apontamento.push(value);
        } else if (key === 'dependencia') {
            vistoria.dependencia.push(value);
        } else if (key === 'fotosExtras') {
            const p = comprimirImagem(value).then(res => {
                vistoria.fotosAdicionais.push(res);
            });
            promises.push(p);
        } else if (value instanceof File && value.size > 0) {
            const p = comprimirImagem(value).then(res => {
                vistoria[key] = res;
            });
            promises.push(p);
        } else if (!(value instanceof File)) {
            vistoria[key] = value;
        }
    }

    await Promise.all(promises);

    return vistoria;
}

// 3. Funções de Ação
async function salvarVistoriaCompleta(formElement) {
    const dados = await processarVistoriaAtual(formElement);
    let historico = JSON.parse(localStorage.getItem('vistorias')) || [];
    historico.push(dados);
    localStorage.setItem('vistorias', JSON.stringify(historico));
    alert("✅ Salvo no dispositivo!");
}

async function enviarParaWhatsApp(formElement) {
    const btn = document.querySelector('.btn-whats');
    btn.textContent = "⌛ Processando...";

    let dados, blob, arquivo;
    try {
        dados = await processarVistoriaAtual(formElement);
        blob = new Blob([JSON.stringify([dados])], { type: 'application/json' });
        arquivo = new File([blob], `Vistoria_${dados.codigoEdificacao}.json`, { type: 'application/json' });
    } catch (e) {
        alert("❌ Erro ao processar o formulário: " + e.message);
        btn.textContent = "📱 WhatsApp";
        return;
    }

    let compartilhou = false;
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [arquivo] })) {
        try {
            await navigator.share({ files: [arquivo], title: 'Vistoria GeoSistema' });
            compartilhou = true;
        } catch (e) {
            if (e.name === 'AbortError') {
                btn.textContent = "📱 WhatsApp";
                return;
            }
        }
    }

    if (!compartilhou) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = arquivo.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        alert("📥 Arquivo baixado!\nAbra o WhatsApp e anexe o arquivo manualmente.");
    }

    btn.textContent = "📱 WhatsApp";
}

async function exportarParaPC(formElement) {
    const dados = await processarVistoriaAtual(formElement);
    const blob = new Blob([JSON.stringify([dados], null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vistoria_${dados.codigoEdificacao}_PC.json`;
    a.click();
}

function limparBancoDados() {
    if (confirm("⚠️ Limpar todas as vistorias antigas?")) {
        localStorage.removeItem('vistorias');
        location.reload();
    }
}