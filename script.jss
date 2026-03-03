let user = localStorage.getItem("user");
if(user) {
    document.getElementById("userDisplay").innerText = user;
}

function logout(){
    localStorage.removeItem("user");
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

    animateValue("totalCO2",0,total,1000);

    document.getElementById("resultCard").classList.remove("hidden");

    let trees = (total/21).toFixed(0);
    document.getElementById("trees").innerText =
        "🌳 Equivalent to planting "+trees+" trees per year";

    let suggestion="";
    if(electricityCO2>2000) suggestion+="Use LED bulbs. ";
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

function animateValue(id,start,end,duration){
    let range=end-start;
    let current=start;
    let increment=end>start?1:-1;
    let stepTime=Math.abs(Math.floor(duration/range));
    let obj=document.getElementById(id);
    let timer=setInterval(function(){
        current+=increment;
        obj.innerHTML=current+" kg CO₂";
        if(current==end){
            clearInterval(timer);
        }
    },stepTime);
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
        li.innerText=s.user+" - "+s.score.toFixed(0)+" kg";
        list.appendChild(li);
    });
}
updateLeaderboard();

async function downloadPDF(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let total=document.getElementById("totalCO2").innerText;
    let trees=document.getElementById("trees").innerText;
    doc.text("CarbonTrack Pro Report",20,20);
    doc.text("User: "+user,20,30);
    doc.text("Annual Footprint: "+total,20,40);
    doc.text(trees,20,50);
    doc.save("carbon-report.pdf");
}
