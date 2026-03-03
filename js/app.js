document.addEventListener("DOMContentLoaded", function(){

let currentStep = 1;

function showStep(num){
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById(num).classList.add("active");
}

document.getElementById("startBtn").onclick = () => {
  currentStep = 2;
  showStep("step2");
};

document.querySelectorAll(".next").forEach(btn=>{
  btn.onclick = () => {
    currentStep++;
    showStep("step"+currentStep);
  };
});

document.querySelectorAll(".back").forEach(btn=>{
  btn.onclick = () => {
    currentStep--;
    showStep("step"+currentStep);
  };
});

document.getElementById("calculateBtn").onclick = calculate;

document.getElementById("restart").onclick = () => {
  currentStep = 1;
  showStep("step1");
};

let chart;

function calculate(){

  let electricity = +document.getElementById("electricity").value || 0;
  let car = +document.getElementById("car").value || 0;
  let flights = +document.getElementById("flights").value || 0;
  let diet = document.getElementById("diet").value;

  let elecCO2 = electricity * 12 * 0.82;
  let carCO2 = car * 12 * 0.21;
  let flightCO2 = flights * 150;
  let dietCO2 = diet==="veg"?1000:2000;

  let total = elecCO2 + carCO2 + flightCO2 + dietCO2;

  animateNumber(total);

  document.getElementById("trees").innerText =
    "🌳 You need approx " + Math.round(total/21) + " trees to offset this.";

  if(chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"),{
    type:'doughnut',
    data:{
      labels:["Electricity","Car","Flights","Diet"],
      datasets:[{
        data:[elecCO2,carCO2,flightCO2,dietCO2],
        backgroundColor:["#4CAF50","#2196F3","#FFC107","#E91E63"]
      }]
    }
  });

  showStep("results");
}

function animateNumber(value){
  let element = document.getElementById("total");
  let start = 0;
  let increment = value / 60;
  let timer = setInterval(()=>{
    start += increment;
    if(start >= value){
      start = value;
      clearInterval(timer);
    }
    element.innerText = Math.round(start) + " kg CO₂";
  }, 15);
}

});
