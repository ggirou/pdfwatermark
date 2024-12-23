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

            const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
            const { width, height } = pages[0].getSize();

            pages.forEach(page => {
                const textWidth = font.widthOfTextAtSize(watermarkText, 50);
                const textHeight = font.heightAtSize(50);
                const margin = 100;

                for (let y = margin; y < height; y += textHeight + margin) {
                    for (let x = margin; x < width; x += textWidth + margin) {
                        page.drawText(watermarkText, {
                            x: x,
                            y: y,
                            size: 50,
                            font: font,
                            color: PDFLib.rgb(0.5, 0.5, 0.5),
                            rotate: PDFLib.degrees(30),
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
