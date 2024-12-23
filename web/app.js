document.getElementById('pdfForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const pdfFile = document.getElementById('pdfFile').files[0];
    const watermarkText = document.getElementById('watermarkText').value;

    if (pdfFile && watermarkText) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(pdfFile);

        reader.onload = async function () {
            const pdfBytes = new Uint8Array(reader.result);
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            const { width, height } = pages[0].getSize();

            // Créer un canvas pour dessiner l'image du watermark
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = '50px Helvetica';
            const textWidth = context.measureText(watermarkText).width;
            const textHeight = 50; // Taille de la police

            // Définir la taille du canvas
            canvas.width = textWidth;
            canvas.height = textHeight;

            // Dessiner le texte sur le canvas
            context.font = '50px Helvetica';
            context.fillStyle = 'rgba(192, 192, 192, 0.5)';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.translate(textWidth / 2, textHeight / 2);
            context.rotate(-Math.PI / 4); // Rotation de -45 degrés
            context.fillText(watermarkText, 0, 0);

            // Convertir le canvas en image
            const dataUrl = canvas.toDataURL('image/png');
            const img = await pdfDoc.embedPng(dataUrl);

            // Dimensions de l'image
            const imgWidth = img.width;
            const imgHeight = img.height;

            // Dessiner l'image du watermark sur chaque page du PDF
            pages.forEach(page => {
                for (let y = 0; y < height; y += imgHeight + 50) {
                    for (let x = 0; x < width; x += imgWidth + 50) {
                        page.drawImage(img, {
                            x: x,
                            y: y,
                            width: imgWidth,
                            height: imgHeight,
                            opacity: 0.5,
                        });
                    }
                }
            });

            const pdfBytesModified = await pdfDoc.save();

            const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            document.getElementById('pdfViewer').src = url;
            document.getElementById('downloadLink').href = url;
        };
    }
});
