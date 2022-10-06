const knob = document.querySelector(".knob");

function calculateDegree(e) {
  const x1 = window.innerWidth / 2;
  const y1 = window.innerHeight / 2;
  const x2 = e.clientX;
  const y2 = e.clientY;

  const deltaX = x1 - x2;
  const deltaY = y1 - y2;

  const radius = Math.atan2(deltaY, deltaX);

  let deg = radius * (180 / Math.PI);

  return deg;
}

knob.addEventListener("mousedown", function() {
  console.log("Mouse Down!!!")
  knob.addEventListener("mousemove", rotate);
    function rotate(e) {
      const result = Math.floor(calculateDegree(e) - 90);
      knob.style.transform = `rotate(${result}deg)`;
    }
    window.addEventListener("mouseup", function () {
      knob.removeEventListener("mousemove", rotate);
    });  
});