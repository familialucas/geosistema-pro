document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializa o mapa
    if (typeof initMapa === "function") initMapa();

    const form = document.getElementById('vistoriaForm');
    const btnWhats = document.querySelector('.btn-whats');
    const btnExportar = document.getElementById('btnExportar');
    const btnLimpar = document.querySelector('.btn-danger');

    // 2. Feedback visual nos cards de foto ao selecionar imagem
    document.querySelectorAll('.img-input input[type="file"]').forEach(function(input) {
        input.addEventListener('change', function() {
            const card = this.closest('.img-input');
            if (this.files && this.files.length > 0) {
                card.classList.add('preenchido');
            } else {
                card.classList.remove('preenchido');
            }
        });
    });

    // 3. Select de urgência muda de cor conforme a escolha
    const selectUrgencia = document.querySelector('select[name="nivelUrgencia"]');
    if (selectUrgencia) {
        function atualizarCorUrgencia() {
            selectUrgencia.classList.remove('urgencia-normal', 'urgencia-atencao', 'urgencia-urgente');
            const v = selectUrgencia.value;
            if (v === 'Normal')   selectUrgencia.classList.add('urgencia-normal');
            if (v === 'Atenção')  selectUrgencia.classList.add('urgencia-atencao');
            if (v === 'Urgente')  selectUrgencia.classList.add('urgencia-urgente');
        }
        selectUrgencia.addEventListener('change', atualizarCorUrgencia);
        atualizarCorUrgencia(); // aplica ao carregar
    }

    // 4. Salvar Vistoria (Botão Azul)
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = "⌛ Salvando...";

            await salvarVistoriaCompleta(this);

            btn.disabled = false;
            btn.textContent = "💾 SALVAR VISTORIA";
        });
    }

    // 5. Enviar WhatsApp (Botão Verde)
    if (btnWhats) {
        btnWhats.addEventListener('click', async function() {
            this.disabled = true;
            await enviarParaWhatsApp(form);
            this.disabled = false;
        });
    }

    // 6. Exportar JSON (Botão Cinza)
    if (btnExportar) {
        btnExportar.addEventListener('click', async function() {
            this.disabled = true;
            await exportarParaPC(form);
            this.disabled = false;
        });
    }

    // 7. Limpar Memória (Botão Vermelho)
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function() {
            if (typeof limparBancoDados === "function") {
                limparBancoDados();
            }
        });
    }
});