const firebaseConfig = {
  apiKey: "AIzaSyBWsAx0o5OnNvgxZDtg3JQR_7Cp_pQKdp0",
  authDomain: "hisacade.firebaseapp.com",
  projectId: "hisacade",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
let currentUser=null;

function hideAll(){
  ["details-section","login-section","course-section","dashboard-section"]
  .forEach(id=>document.getElementById(id).style.display="none");
}

function saveDetails(){
  const name=document.getElementById("name").value;
  const phone=document.getElementById("phone").value;

  if(!name||!phone){alert("Fill all details");return;}

  localStorage.setItem("name",name);
  localStorage.setItem("phone",phone);

  hideAll();
  document.getElementById("login-section").style.display="block";
}

function googleLogin(){
  const provider=new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

auth.onAuthStateChanged(async(user)=>{
  hideAll();

  if(!user){
    document.getElementById("details-section").style.display="block";
    return;
  }

  currentUser=user;
  const email=user.email;
  const userRef=db.collection("users").doc(email);
  let doc=await userRef.get();

  if(!doc.exists){
    await userRef.set({
      name:localStorage.getItem("name")||user.displayName,
      phone:localStorage.getItem("phone")||"",
      paid:false
    });
  }

  const urlParams=new URLSearchParams(window.location.search);
  if(urlParams.get("paid")==="1"){
    await userRef.update({paid:true});
    window.history.replaceState({},document.title,window.location.pathname);
  }

  doc=await userRef.get();

  if(doc.data().paid===true){
    showDashboard();
  }else{
    document.getElementById("course-section").style.display="block";
  }
});

async function showDashboard(){
  document.getElementById("dashboard-section").style.display="block";

  document.getElementById("welcome-text").innerText=
  "Welcome, "+currentUser.displayName;

  document.getElementById("profile-name").innerText=
  "Name: "+currentUser.displayName;

  document.getElementById("profile-email").innerText=
  "Email: "+currentUser.email;

  document.getElementById("profile-phone").innerText=
  "Phone: "+(localStorage.getItem("phone")||"");

  const doc=await db.collection("adminContent").doc("main").get();

  if(doc.exists){
    document.getElementById("today-time").innerText=
    doc.data().todayTime||"";

    document.getElementById("daily-message").innerText=
    doc.data().dailyMessage||"";

    const liveLink = doc.data().liveLink || "";

if(liveLink && liveLink.includes("youtube")){
  document.getElementById("live-container").innerHTML =
  `<iframe src="${liveLink}" allowfullscreen></iframe>`;
}else{
  document.getElementById("live-container").innerHTML =
  `<p>Live will start soon ⏳</p>`;
}

  }

  loadMotivation();
}

async function loadMotivation(){
  const snapshot=await db.collection("motivations").get();
  const images=[];
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

function callSir(){
  window.location.href="tel:7022322709";
}

function logoutUser(){
  auth.signOut().then(()=>location.reload());
}
