const canvas = document.querySelector('.background');
const context = canvas.getContext('2d');

const width = canvas.width = innerWidth;
const height = canvas.height = innerHeight;

const fl = 300;
const shapes = [];
const noOfShapes = 10;

let mouseX = 0;
let mouseY = 0;

addEventListener('mousemove', (ev) => {
    mouseX = ev.clientX - width / 2;
    mouseY = ev.clientY - height / 2;
});

export const canvasDraw = () => {
    const colorRange = Math.ceil(Math.random() * 360 / 30) * 30;
    for(let i = 0; i < noOfShapes; i++) {
        shapes[i] = {
            x: Math.floor(Math.random() * 2000 - 1000),
            y: Math.floor(Math.random() * 2000 - 1000),
            z: Math.floor(Math.random()*1000),
            speed: Math.random() * 2 + 2,
            hue: Math.random() * 30 + colorRange
        };
    }

    context.translate(width/2, height/2);
    update();
}

function update() {
    context.fillStyle = '#03182547';
    context.fillRect(-width/2, -height/2, width, height);
    for(let i = 0; i < noOfShapes; i++) {
        const shape = shapes[i];
        const perspective = fl / (fl + shape.z);

        const dx = shape.x * perspective - mouseX;
        const dy = shape.y * perspective - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < 150) {
            const angle = Math.atan2(dy, dx);
            shape.x += Math.cos(angle) * (150 - distance) * 0.05;
            shape.y += Math.sin(angle) * (150 - distance) * 0.05;
        }

        context.save();
        context.translate(shape.x * perspective, shape.y * perspective);
        context.scale(perspective, perspective);

        drawShape(shape, distance);

        context.restore();

        shape.z -= shape.speed;
        if(shape.z < 0) {
            shape.z = 1000;
            shape.x = Math.floor(Math.random() * 2000 - 1000);
            shape.y = Math.floor(Math.random() * 2000 - 1000);
        }
    }

    requestAnimationFrame(update);
}

function drawShape(shape, distance) {
    // Create a radial gradient for a glowing star effect
    const gradient = context.createRadialGradient(
        -20, -20, 0,    // Inner circle (center, bright)
        -20, -20, 40    // Outer circle (fades out)
    );
    gradient.addColorStop(0, `hsla(${shape.hue}, 80%, 100%, 1)`); // Bright core
    gradient.addColorStop(0.3, `hsla(${shape.hue}, 80%, 70%, 0.8)`); // Soft midglow
    gradient.addColorStop(1, `hsla(${shape.hue}, 80%, 50%, 0)`); // Transparent edge

    // Draw the glowing star
    context.beginPath();
    context.arc(-10, -10, 20, 0, 2 * Math.PI);
    context.fillStyle = gradient;
    context.fill();
}
