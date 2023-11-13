document.addEventListener('DOMContentLoaded', run);

async function run() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const personCountElement = document.getElementById('personCount');

    // Access the webcam
    const stream = await navigator.mediaDevices.getUserMedia({ 'video': {} });
    video.srcObject = stream;

    // Load the COCO-SSD model
    const model = await cocoSsd.load();

    // Detect persons in each video frame
    detectPersons();

    let personCount = 0;

    async function detectPersons() {
        const predictions = await model.detect(video);
        drawBoxes(predictions);
        updatePersonCount(predictions);
        requestAnimationFrame(detectPersons);
    }

    function drawBoxes(predictions) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        predictions.forEach(prediction => {
            if (prediction.class === 'person') {
                const [x, y, width, height] = prediction.bbox;
                ctx.beginPath();
                ctx.rect(x, y, width, height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'red';
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                ctx.stroke();
                ctx.fill();
            }
        });
    }

    function updatePersonCount(predictions) {
        personCount = predictions.filter(prediction => prediction.class === 'person').length;
        personCountElement.textContent = personCount;
    }
}
