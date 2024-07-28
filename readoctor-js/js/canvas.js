document.addEventListener("DOMContentLoaded", function () {
    const canvasElement = document.getElementById("canvas");
    const ctx = canvasElement.getContext('2d');

    const canvasManager = new CanvasManager(canvasElement, ctx);
    const toolsManager = new ToolsManager(canvasManager);
    const brushesOptionsManager = new BrushesOptionsManager(canvasManager);
    const fileOptionsManager = new FileOptionsManager(canvasElement, ctx);
});

class CanvasManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.pos = { x: 0, y: 0 };
        this.currentTool = '';
        this.canDraw = false;
        this.currentColor = '#c0392b';
        this.brushSize = 10;

        this.init();
    }

    init() {
        document.body.style.margin = 0;
        this.resizeCanvas();

        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => this.draw(e));
        document.addEventListener('mousedown', (e) => this.setPosition(e));
        document.addEventListener('mouseenter', (e) => this.setPosition(e));
    }

    resizeCanvas() {
        let scaleFactor = window.devicePixelRatio;
        this.ctx.canvas.width = Math.floor(this.canvas.offsetWidth / scaleFactor);
        this.ctx.canvas.height = Math.floor(this.canvas.offsetHeight / scaleFactor);
    }

    setPosition(e) {
        this.pos.x = e.clientX - this.canvas.getBoundingClientRect().left - this.canvas.width / 2;
        this.pos.y = e.clientY - this.canvas.getBoundingClientRect().top - this.canvas.height / 2;
    }

    draw(e) {
        if (!this.canDraw || e.buttons !== 1) return;

        this.ctx.beginPath();

        if (this.currentTool === 'brush') {
            this.ctx.lineWidth = this.brushSize;
            this.ctx.lineCap = 'round';
            this.ctx.strokeStyle = this.currentColor;
        } else if (this.currentTool === 'eraser') {
            this.ctx.lineWidth = this.brushSize + 10;
            this.ctx.lineCap = 'round';
            this.ctx.strokeStyle = '#ffffff';
        }

        this.ctx.moveTo(this.pos.x + this.canvas.width / 2, this.pos.y + this.canvas.height / 2);
        this.setPosition(e);
        this.ctx.lineTo(this.pos.x + this.canvas.width / 2, this.pos.y + this.canvas.height / 2);

        this.ctx.stroke();
    }
}

class ToolsManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.brushButton = document.getElementById("brush");
        this.eraserButton = document.getElementById("eraser");
        this.colorsButton = document.getElementById("colors");
        this.colorPicker = document.getElementById("colorPicker");

        this.init();
    }

    init() {
        this.brushButton.addEventListener("click", () => this.selectTool('brush', this.brushButton));
        this.eraserButton.addEventListener("click", () => this.selectTool('eraser', this.eraserButton));
        this.colorsButton.addEventListener("click", () => this.colorPicker.click());

        this.colorPicker.addEventListener("input", () => {
            this.canvasManager.currentColor = this.colorPicker.value;
        });
    }

    selectTool(tool, button) {
        this.resetButtonColors();
        if (button.style.backgroundColor === "gray") {
            button.style.backgroundColor = "white";
            this.canvasManager.canDraw = false;
        } else {
            button.style.backgroundColor = "gray";
            document.getElementById('brushes-option').style.opacity = '1';
            this.canvasManager.currentTool = tool;
            this.canvasManager.canDraw = true;
            this.canvasManager.canvas.style.cursor = `url("${tool}-cursor.png"), auto`;
        }
    }

    resetButtonColors() {
        this.brushButton.style.backgroundColor = "white";
        this.eraserButton.style.backgroundColor = "white";
        this.colorsButton.style.backgroundColor = "white";
    }
}

class BrushesOptionsManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.increaseSizeButton = document.getElementById("increaseSize");
        this.decreaseSizeButton = document.getElementById("decreaseSize");
        this.textBoxSize = document.getElementById('textbox_option');
        this.brushSizeDisplay = document.getElementById("brushSize");

        this.init();
    }

    init() {
        this.increaseSizeButton.addEventListener("click", () => this.changeBrushSize(1));
        this.decreaseSizeButton.addEventListener("click", () => this.changeBrushSize(-1));
        this.textBoxSize.addEventListener("input", () => this.updateBrushSizeFromText());

        this.updateBrushSizeDisplay();
    }

    changeBrushSize(delta) {
        this.canvasManager.brushSize = Math.max(1, this.canvasManager.brushSize + delta);
        this.updateBrushSizeDisplay();
    }

    updateBrushSizeFromText() {
        let newSize = parseInt(this.textBoxSize.value, 10);
        if (!isNaN(newSize) && newSize > 0) {
            this.canvasManager.brushSize = newSize;
            this.updateBrushSizeDisplay();
        }
    }

    updateBrushSizeDisplay() {
        this.brushSizeDisplay.innerText = `Размер кисти: ${this.canvasManager.brushSize}`;
        this.textBoxSize.value = `${this.canvasManager.brushSize}`;
    }
}

class FileOptionsManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.uploadButton = document.getElementById('upload-btn');
        this.uploadInput = document.getElementById('upload');
        this.saveButton = document.getElementById('save-btn');

        this.init();
    }

    init() {
        this.uploadButton.addEventListener('click', () => this.uploadInput.click());
        this.uploadInput.addEventListener('change', (e) => this.uploadFile(e));
        this.saveButton.addEventListener('click', () => this.saveCanvas());
    }

    uploadFile(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            };
            img.src = event.target.result;
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    saveCanvas() {
        const link = document.createElement('a');
        link.download = 'canvas-image.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}
