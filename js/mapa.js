const dadosBairros = {
    "CIA": { codigo: "BR 040281", cidade: "Simões Filho" },
    "Coroa da Lagoa": { codigo: "BR 04 0767", cidade: "Simões Filho" },
    "Covel": { codigo: "BR 04 2566", cidade: "Simões Filho" },
    "Ilha de São João": { codigo: "BR 04 0934", cidade: "Simões Filho" },
    "Luiz Eduardo": { codigo: "BR 04 0533", cidade: "Simões Filho" },
    "Mapele": { codigo: "BR 04 1760", cidade: "Simões Filho" },
    "Nova Pitanguinha": { codigo: "BR 04 0480", cidade: "Simões Filho" },
    "Palmares": { codigo: "BR 04 1732", cidade: "Simões Filho" },
    "Ponto Parada": { codigo: "BR 04 2372", cidade: "Simões Filho" },
    "Santo Antônio Rios das Pedras": { codigo: "BR 04 1613", cidade: "Simões Filho" },
    "Simões Filho 1": { codigo: "BR 04 2139", cidade: "Simões Filho" },
    "Areia Branca": { codigo: "BR 04 1466", cidade: "Lauro de Freitas" },
    "Caic": { codigo: "BR 04 1599", cidade: "Lauro de Freitas" },
    "Itinga": { codigo: "BR 04 0475", cidade: "Lauro de Freitas" },
    "Pq São Paulo": { codigo: "BR 04 1176", cidade: "Lauro de Freitas" },
    "Portão": { codigo: "BR 04 1103", cidade: "Lauro de Freitas" },
    "Praia de Ipitanga": { codigo: "BR 04 1055", cidade: "Lauro de Freitas" },
    "Vida Nova": { codigo: "BR 04 1806", cidade: "Lauro de Freitas" }
};

const coordenadasBairros = {
    "CIA": [-12.8073, -38.4052], "Coroa da Lagoa": [-12.7814, -38.3967], "Covel": [-12.7710, -38.4179],
    "Ilha de São João": [-12.7819, -38.4253], "Luiz Eduardo": [-12.7932, -38.4118], "Mapele": [-12.7514, -38.4572],
    "Nova Pitanguinha": [-12.7921, -38.3918], "Palmares": [-12.7699, -38.4062], "Ponto Parada": [-12.7734, -38.4259],
    "Santo Antônio Rios das Pedras": [-12.8016, -38.4021], "Simões Filho 1": [-12.7882, -38.4010],
    "Areia Branca": [-12.8847, -38.3325], "Caic": [-12.8842, -38.3177], "Itinga": [-12.8913, -38.3269],
    "Pq São Paulo": [-12.8801, -38.3354], "Portão": [-12.9025, -38.3338], "Praia de Ipitanga": [-12.9058, -38.3416],
    "Vida Nova": [-12.8816, -38.3202]
};

let mapa, marcador;

function initMapa() {
    mapa = L.map('mapa').setView([-12.7845, -38.4030], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);

    const selectBairro = document.getElementById('bairro');
    Object.keys(dadosBairros).forEach(b => {
        let opt = document.createElement('option');
        opt.value = b; opt.textContent = b;
        selectBairro.appendChild(opt);
    });

    selectBairro.addEventListener('change', function() {
        const b = this.value;
        if (dadosBairros[b]) {
            document.getElementById('codigoEdificacao').value = dadosBairros[b].codigo;
            document.getElementById('cidade').value = dadosBairros[b].cidade;
            const coords = coordenadasBairros[b];
            mapa.setView(coords, 16);
            if (marcador) mapa.removeLayer(marcador);
            marcador = L.marker(coords).addTo(mapa);
            document.getElementById('latitude').value = coords[0];
            document.getElementById('longitude').value = coords[1];
        }
    });
}