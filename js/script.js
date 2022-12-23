// GLOBALS VARIABLES
const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlide = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvasBtn = document.querySelector(".clear-canvas"),
  saveImgBtn = document.querySelector(".save-img"),
  saveDisabled = document.querySelector(".save-disabled");

// VARIABLES
let ctx = canvas.getContext("2d"),
  isDrawing = false,
  brushWidth = 5,
  selectedTool = "brush",
  selectedColor = "#000",
  prewMouseX,
  prewMouseY,
  snapshot;

// SET CANVAS BACGROUND
const setCanvasBg = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

// CANVAS VARIABLES
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBg();
});

// START DRAWING
const startDraw = (e) => {
  isDrawing = true;
  prewMouseX = e.offsetX;
  prewMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// START DRAWRECTANGLE
const drawRectangle = (e) => {
  fillColor.checked
    ? ctx.fillRect(
        e.offsetX,
        e.offsetY,
        prewMouseX - e.offsetX,
        prewMouseY - e.offsetY,
      )
    : ctx.strokeRect(
        e.offsetX,
        e.offsetY,
        prewMouseX - e.offsetX,
        prewMouseY - e.offsetY,
      );
};

// DRAW CIRCLE
const drawCircle = (e) => {
  ctx.beginPath();
  const radius =
    Math.sqrt(Math.pow(prewMouseX - e.offsetX, 2)) +
    Math.pow(prewMouseY - e.offsetY, 2);
  ctx.arc(prewMouseX, prewMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// DRAW TRIANGLE
const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prewMouseX, prewMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prewMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// START DRAWING
const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  switch (selectedTool) {
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case "rectangle":
      drawRectangle(e);
      break;
    case "circle":
      drawCircle(e);
      break;
    case "triangle":
      drawTriangle(e);
      break;
    case "eraser":
      ctx.strokeStyle = "#fff";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    default:
      break;
  }
};

// SAVE LIKE IMG
saveImgBtn.addEventListener("click", (e) => {
  const link = document.createElement("a");
  link.download = `Proyekt Paint ${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
  if (e) {
    saveDisabled.style.display = "flex";
    setInterval(() => {
      saveDisabled.style.display = "none";
    }, 2000);
  }
});

// CLEAR CANVAS BTN
clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBg();
});

// CHANGE BRUSH WIDTH
sizeSlide.addEventListener("change", () => (brushWidth = sizeSlide.value));

// TOOLS BTNS
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedTool = btn.id;
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
  });
});
const stopDraw = () => {
  isDrawing = false;
};

// COLOR BTNS
colorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = bgColor;
  });
});

// SET COLOR FROM PICKER
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

// DRAW EVENTS
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
