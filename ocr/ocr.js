function preprocessImage(img) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Konwersja obrazu do skali szarości
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
}

document.body.addEventListener('paste', async (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
            const blob = item.getAsFile();
            const url = URL.createObjectURL(blob);
            document.getElementById('image').src = url;
            const img = new Image();
            img.src = url;
            img.onload = async () => {
                preprocessImage(img);
                const canvas = document.getElementById('canvas');
                const { data: { text } } = await Tesseract.recognize(canvas, 'pol', {
                    logger: m => console.log(m)
                });
                document.getElementById('output').innerText = text;
            };
        }
    }
});