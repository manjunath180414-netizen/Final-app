const firebaseConfig = {
  apiKey: "AIzaSyBWsAx0o5OnNvgxZDtg3JQR_7Cp_pQKdp0",
  authDomain: "hisacade.firebaseapp.com",
  projectId: "hisacade"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async(user)=>{
  if(!user){
    alert("Please login first.");
    return;
  }

  document.getElementById("welcome-text").innerText =
  "Welcome, " + user.displayName;

  document.getElementById("profile-name").innerText =
  "Name: " + user.displayName;

  document.getElementById("profile-email").innerText =
  "Email: " + user.email;

  loadDashboard();
});

async function loadDashboard(){

  const doc = await db.collection("adminContent").doc("main").get();

  if(doc.exists){

    document.getElementById("today-time").innerText =
    doc.data().todayTime || "";

    document.getElementById("daily-message").innerText =
    doc.data().dailyMessage || "";

    const liveLink = doc.data().liveLink || "";

    if(liveLink){
      document.getElementById("live-container").innerHTML =
      `<iframe src="${liveLink}" allowfullscreen></iframe>`;
    }else{
      document.getElementById("live-container").innerHTML =
      `<p>Live will start soon ⏳</p>`;
    }

    startCountdown(doc.data().examDate);
  }

  loadMotivations();
  loadRecorded();
}

function startCountdown(dateStr){
  if(!dateStr) return;

  const examDate = new Date(dateStr).getTime();

  setInterval(()=>{
    const now = new Date().getTime();
    const diff = examDate - now;

    if(diff > 0){
      const days = Math.floor(diff/(1000*60*60*24));
      const hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60));

      document.getElementById("daily-message").innerHTML +=
      `<br><br>⏳ ${days} Days ${hours} Hours left for Exam`;
    }
  },1000);
}

async function loadMotivations(){
  const snapshot = await db.collection("motivations").get();
  const images = [];
  snapshot.forEach(doc=>images.push(doc.data().imageUrl));

  let index=0;
  if(images.length>0){
    document.getElementById("motivation-img").src=images[0];
    setInterval(()=>{
      index=(index+1)%images.length;
      document.getElementById("motivation-img").src=images[index];
    },3000);
  }
}

async function loadRecorded(){
  const snapshot = await db.collection("videos").get();
  let html="";

  snapshot.forEach(doc=>{
    html+=`
      <p>${doc.data().title}</p>
      <iframe src="${doc.data().link}" allowfullscreen></iframe>
    `;
  });

  document.getElementById("recorded-container").innerHTML = html;
}

function callSir(){
  window.location.href="tel:+917022322709";
}

function logoutUser(){
  auth.signOut().then(()=>location.reload());
}
