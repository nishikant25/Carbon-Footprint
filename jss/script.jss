const user = localStorage.getItem("carbonUser");

if(!user){
window.location.href="index.html";
}

document.getElementById("userName").innerText = user;

function logout(){
localStorage.removeItem("carbonUser");
window.location.href="index.html";
}

function calculate(){

let electricity = parseFloat(document.getElementById("electricity").value)||0;
let car = parseFloat(document.getElementById("car").value)||0;
let flights = parseFloat(document.getElementById("flights").value)||0;
let diet = document.getElementById("diet").value;

let electricityCO2 = electricity*12*0.82;
let carCO2 = car*12*0.21;
let flightCO2 = flights*150;
let dietCO2 = diet==="veg"?1000:2000;

let total = electricityCO2+carCO2+flightCO2+dietCO2;

animateCounter(total);

document.getElementById("resultCard").classList.remove("hidden");

let trees = Math.round(total/21);
document.getElementById("trees").innerText =
"Equivalent to planting "+trees+" trees 🌳";

let suggestion="";
if(electricityCO2>2000) suggestion+="Reduce electricity usage. ";
if(carCO2>1500) suggestion+="Use public transport. ";
if(diet==="nonveg") suggestion+="Try plant-based meals. ";
if(suggestion==="") suggestion="Great job! Keep it up.";

document.getElementById("suggestions").innerText=suggestion;

new Chart(document.getElementById("chart"),{
type:'doughnut',
data:{
labels:["Electricity","Car","Flights","Diet"],
datasets:[{data:[electricityCO2,carCO2,flightCO2,dietCO2]}]
}
});

saveScore(user,total);
}

function animateCounter(value){
let element=document.getElementById("totalCO2");
let start=0;
let duration=1000;
let increment=value/50;
let timer=setInterval(()=>{
start+=increment;
if(start>=value){
start=value;
clearInterval(timer);
}
element.innerText=Math.round(start)+" kg CO₂";
},duration/50);
}

function saveScore(user,score){
let scores=JSON.parse(localStorage.getItem("scores"))||[];
scores.push({user:user,score:score});
scores.sort((a,b)=>a.score-b.score);
localStorage.setItem("scores",JSON.stringify(scores));
updateLeaderboard();
}

function updateLeaderboard(){
let scores=JSON.parse(localStorage.getItem("scores"))||[];
let list=document.getElementById("leaderboard");
list.innerHTML="";
scores.slice(0,5).forEach(s=>{
let li=document.createElement("li");
li.innerText=s.user+" - "+Math.round(s.score)+" kg";
list.appendChild(li);
});
}
updateLeaderboard();

async function downloadPDF(){
const { jsPDF } = window.jspdf;
const doc = new jsPDF();
doc.text("CarbonTrack Pro Report",20,20);
doc.text("User: "+user,20,30);
doc.text(document.getElementById("totalCO2").innerText,20,40);
doc.text(document.getElementById("trees").innerText,20,50);
doc.save("Carbon_Report.pdf");
}
