let qrColor = '#000000';
let bgColor = '#ffffff';

// Configuração comum para os seletores
const pickrConfig = {
    theme: 'nano',
    components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
            input: true,
            save: true // O botão salvar continua lá como você queria
        }
    }
};

// Seletor da Cor do QR Code
const pickrQR = Pickr.create({
    el: '#color-picker-qr',
    default: qrColor,
    ...pickrConfig
}).on('change', (color) => {
    qrColor = color.toHEXA().toString();
    gerarQRCode(true); // Atualiza instantaneamente ao mudar
});

// Seletor da Cor de Fundo
const pickrBG = Pickr.create({
    el: '#color-picker-bg',
    default: bgColor,
    ...pickrConfig
}).on('change', (color) => {
    bgColor = color.toHEXA().toString();
    gerarQRCode(true); // Atualiza instantaneamente ao mudar
});

function togglePersonalizacao() {
    const panel = document.getElementById('custom-panel');
    panel.classList.toggle('hidden');
}

function gerarQRCode(isUpdate = false) {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const qrcodeDiv = document.getElementById('qrcode');
    const captureArea = document.getElementById('capture-area');
    const label = document.getElementById('label-contato');
    const resultado = document.getElementById('resultado');

    if (!nome || !telefone) {
        alert("Preencha as informações!");
        return;
    }

    qrcodeDiv.innerHTML = "";
    captureArea.style.backgroundColor = bgColor;
    label.innerText = nome;
    label.style.color = qrColor;

    // Formato VCard para salvar na agenda
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${nome}\nTEL:${telefone}\nEND:VCARD`;

    new QRCode(qrcodeDiv, {
        text: vcard,
        width: 200,
        height: 200,
        colorDark : qrColor,
        colorLight : bgColor,
        correctLevel : QRCode.CorrectLevel.H
    });

    if (!isUpdate) {
        resultado.classList.remove('hidden');
    }
}

async function baixarImagemCompleta() {
    const area = document.getElementById('capture-area');
    const nome = document.getElementById('nome').value;
    
    // Gera a imagem da área de captura
    const canvas = await html2canvas(area);
    const link = document.createElement('a');
    link.download = `QR_${nome.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL();
    link.click();
}