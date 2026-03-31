let logoData = "";
let cropper = null;

const logoInput = document.getElementById('logoInput');
const modalCrop = document.getElementById('modal-crop');
const imageToCrop = document.getElementById('image-to-crop');

logoInput.addEventListener('change', function(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageToCrop.src = event.target.result;
            modalCrop.classList.add('active');
            if (cropper) cropper.destroy();
            cropper = new Cropper(imageToCrop, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1
            });
        };
        reader.readAsDataURL(files[0]);
    }
});

function cancelarCrop() {
    modalCrop.classList.remove('active');
    logoInput.value = "";
}

function salvarCrop() {
    const canvas = cropper.getCroppedCanvas({ width: 500, height: 500 });
    logoData = canvas.toDataURL("image/png");
    modalCrop.classList.remove('active');
    if(!document.getElementById('resultado').classList.contains('hidden')) gerarQRCode(true);
}

['cor-qr', 'cor-fundo-qr', 'cor-nome', 'cor-funcao'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => gerarQRCode(true));
});

function gerarQRCode(isUpdate = false) {
    const nome = document.getElementById('nome').value;
    const trabalho = document.getElementById('trabalho').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    
    if (!nome || !telefone) {
        if (!isUpdate) alert("Preencha Nome e Telefone!");
        return;
    }

    document.getElementById('panel-estilo').classList.add('open');
    document.getElementById('resultado').classList.remove('hidden');

    const corQR = document.getElementById('cor-qr').value;
    const corFundoQR = document.getElementById('cor-fundo-qr').value;
    const corNome = document.getElementById('cor-nome').value;
    const corFuncao = document.getElementById('cor-funcao').value;

    document.getElementById('label-nome').innerText = nome;
    document.getElementById('label-nome').style.color = corNome;
    document.getElementById('label-funcao').innerText = trabalho;
    document.getElementById('label-funcao').style.color = corFuncao;
    document.getElementById('capture-area').style.backgroundColor = corFundoQR;

    const container = document.getElementById('canvas-container');
    container.innerHTML = ""; 

    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${nome}\nTITLE:${trabalho}\nTEL:${telefone}\nEMAIL:${email}\nEND:VCARD`;

    const qrCode = new QRCodeStyling({
        width: 250, height: 250, type: "svg", data: vcard, image: logoData,
        dotsOptions: { color: corQR, type: "rounded" },
        backgroundOptions: { color: corFundoQR },
        imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.5 }
    });

    qrCode.append(container);
    if (!isUpdate) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

async function downloadQR() {
    const area = document.getElementById('capture-area');
    const canvas = await html2canvas(area, { scale: 3, useCORS: true });
    const link = document.createElement('a');
    // NOME DO ARQUIVO ATUALIZADO
    link.download = `ConnectQR_${document.getElementById('nome').value.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL();
    link.click();
}