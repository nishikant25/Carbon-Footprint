document.addEventListener("DOMContentLoaded", () => {

const user = localStorage.getItem("carbonUser");

// ===== LOGIN =====
const loginBtn = document.getElementById("loginBtn");
if(loginBtn){
loginBtn.addEventListener("click", () => {
const name = document.getElementById("username").value.trim();
if(!name) return alert("Enter your name");
localStorage.setItem("carbonUser", name);
window.location.href="dashboard.html";
});
}

// ===== DASHBOARD AUTH =====
const userDisplay = document.getElementById("userDisplay");
if(userDisplay){
if(!user){
window.location.href="index.html";
return;
}
userDisplay.innerText = user;
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn){
logoutBtn.addEventListener("click",()=>{
localStorage.removeItem("carbonUser");
window.location.href="index.html";
});
}

const calculateBtn = document.getElementById("calculateBtn");
if(calculateBtn){
calculateBtn.addEventListener("click", calculateFootprint);
}

const pdfBtn = document.getElementById("pdfBtn");
if(pdfBtn){
pdfBtn.addEventListener("click", generatePDF);
}

updateLeaderboard();
});

let chartInstance;

// ===== CALCULATION ENGINE =====
function calculateFootprint(){

const country = document.getElementById("country").value;
const electricity = +document.getElementById("electricity").value || 0;
const car = +document.getElementById("car").value || 0;
const flights = +document.getElementById("flights").value || 0;
const diet = document.getElementById("diet").value;

const emissionFactors = {
india: 0.82,
usa: 0.92,
uk: 0.45
};

let electricityCO2 = electricity * 12 * emissionFactors[country];
let carCO2 = car * 12 * 0.21;
let flightCO2 = flights * 150;
let dietCO2 = diet==="veg" ? 1000 : 2000;

let total = electricityCO2 + carCO2 + flightCO2 + dietCO2;

displayResults(total, electricityCO2, carCO2, flightCO2, dietCO2);
saveScore(localStorage.getItem("carbonUser"), total);
}

// ===== DISPLAY =====
function displayResults(total,e,c,f,d){

document.getElementById("resultSection").classList.remove("hidden");
document.getElementById("totalOutput").innerText = Math.round(total)+" kg CO₂";

const avgIndia = 1900;
document.getElementById("comparison").innerText =
total > avgIndia ? "Above India’s average footprint." :
"Below India’s average footprint. Great!";

document.getElementById("trees").innerText =
"🌳 Plant "+Math.round(total/21)+" trees to offset this.";

if(chartInstance) chartInstance.destroy();

chartInstance = new Chart(document.getElementById("chart"),{
type:'doughnut',
data:{
labels:["Electricity","Car","Flights","Diet"],
datasets:[{
data:[e,c,f,d],
backgroundColor:["#4CAF50","#2196F3","#FFC107","#E91E63"]
}]
}
});

document.getElementById("suggestions").innerText =
generateSuggestions(total);
}

// ===== SMART SUGGESTIONS =====
function generateSuggestions(total){
if(total>4000) return "High footprint. Reduce travel and energy use.";
if(total>2000) return "Moderate footprint. Improve efficiency.";
return "Low footprint. Keep it sustainable!";
}

// ===== LEADERBOARD =====
function saveScore(user,score){
let scores = JSON.parse(localStorage.getItem("scores"))||[];
let existing = scores.find(s=>s.user===user);
if(existing) existing.score = score;
else scores.push({user,score});
scores.sort((a,b)=>a.score-b.score);
localStorage.setItem("scores",JSON.stringify(scores));
updateLeaderboard();
}

function updateLeaderboard(){
let scores = JSON.parse(localStorage.getItem("scores"))||[];
let list = document.getElementById("leaderboard");
if(!list) return;
list.innerHTML="";
scores.slice(0,5).forEach((s,i)=>{
let li=document.createElement("li");
li.innerText=(i+1)+". "+s.user+" - "+Math.round(s.score)+" kg";
list.appendChild(li);
});
}

// ===== PDF =====
function generatePDF(){
const { jsPDF } = window.jspdf;
const doc = new jsPDF();
doc.setFontSize(18);
doc.text("CarbonTrack Pro Report",20,20);
doc.setFontSize(12);
doc.text("User: "+localStorage.getItem("carbonUser"),20,35);
doc.text("Annual Emission: "+document.getElementById("totalOutput").innerText,20,45);
doc.save("Carbon_Report.pdf");
}
