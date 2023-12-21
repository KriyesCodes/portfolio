import { isLightMode } from "./themeChanger.js";

const body = document.body;

const lightFillColor = getComputedStyle(body).getPropertyValue(
	"--primary-background-color"
);
const darkFillColor = getComputedStyle(body).getPropertyValue(
	"--secondary-text-color"
);

const pixelArray = [];

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

const mouse = {
	x: undefined,
	y: undefined,
};

let mouseDown = false;

body.addEventListener("mousedown", function () {
	mouseDown = true;
});
body.addEventListener("mouseup", function () {
	mouseDown = false;
});

body.addEventListener("mousemove", function (e) {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

// function drawBorderedRectangle(xPos, yPos, height, width) {
// 	ctx.fillStyle = lightFillColor;
// 	ctx.strokeStyle = darkFillColor;
// 	ctx.lineWidth = 4;
// 	ctx.fillRect(xPos, yPos, width, height);
// 	ctx.strokeRect(xPos, yPos, width, height);
// }

class Pixel {
	constructor(xPos, yPos, size, color) {
		this.x = xPos;
		this.y = yPos;
		this.size = size;
		this.color = color;
		this.opacity = 1;
	}

	update() {
		const mouseRadius = 100;
		const distanceToMouse = Math.sqrt(
			(mouse.x - this.x) * (mouse.x - this.x) +
				(mouse.y - this.y) * (mouse.y - this.y)
		);
		if (distanceToMouse < mouseRadius) {
			this.opacity = 0;
		} else {
			this.opacity += 0.01;
			if (this.opacity > 1) {
				this.opacity = 1;
			}
		}
	}

	draw() {
		ctx.fillStyle =
			this.color + decimalToHex(Math.floor(this.opacity * 255), 2);
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}
}

const rowPixelCount = 50;
const pixelSize = Math.floor(canvas.width / rowPixelCount);
const columnPixelCount = Math.floor(canvas.height / pixelSize);

function init() {
	for (let i = 0; i <= rowPixelCount; ++i) {
		for (let j = 0; j <= columnPixelCount; ++j) {
			pixelArray.push(
				new Pixel(i * pixelSize, j * pixelSize, pixelSize, lightFillColor)
			);
		}
	}
}

function updatePixels() {
	for (let i = 0; i < pixelArray.length; ++i) {
		pixelArray[i].update();
		pixelArray[i].draw();
	}
}

function decimalToHex(d, padding) {
	let hex = Number(d).toString(16);
	padding =
		typeof padding === "undefined" || padding === null
			? (padding = 2)
			: padding;

	while (hex.length < padding) {
		hex = "0" + hex;
	}

	return hex;
}

init();

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updatePixels();
	requestAnimationFrame(animate);
}

animate();
