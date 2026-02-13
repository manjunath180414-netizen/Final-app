// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBWsAx0o5OnNvgxZDtg3JQR_7Cp_pQKdp0",
  authDomain: "hisacade.firebaseapp.com",
  projectId: "hisacade",
  storageBucket: "hisacade.firebasestorage.app",
  messagingSenderId: "148271520741",
  appId: "1:148271520741:web:5fce8f04c325d59601ed0c"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;


// 🔹 HIDE ALL SECTIONS
function hideAll(){
  document.getElementById("details-section").style.display = "none";
  document.getElementById("login-section").style.display = "none";
  document.getElementById("course-section").style.display = "none";
  document.getElementById("dashboard-section").style.display = "none";
}


// 🔹 SAVE NAME + PHONE
function saveDetails(){
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if(!name || !phone){
    alert("Please fill all details");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("phone", phone);

  hideAll();
  document.getElementById("login-section").style.display = "block";
}


// 🔹 GOOGLE LOGIN
function googleLogin(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .catch(error => {
      alert(error.message);
    });
}


// 🔹 AUTH STATE HANDLER
auth.onAuthStateChanged(async(user)=>{

  hideAll();

  // If not logged in → show first form
  if(!user){
    document.getElementById("details-section").style.display = "block";
    return;
  }

  currentUser = user;
  const email = user.email;

  const userRef = db.collection("users").doc(email);
  let doc = await userRef.get();

  // First time user
  if(!doc.exists){
    await userRef.set({
      name: localStorage.getItem("name") || user.displayName,
      phone: localStorage.getItem("phone") || "",
      paid: false
    });

    document.getElementById("course-section").style.display = "block";
    return;
  }

  // 🔥 Razorpay Redirect Detection
  const urlParams = new URLSearchParams(window.location.search);
  const paidParam = urlParams.get("paid");

  if(paidParam === "1"){
    await userRef.update({ paid: true });
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  doc = await userRef.get();

  if(doc.data().paid === true){
    showDashboard();
  }else{
    document.getElementById("course-section").style.display = "block";
  }

});


// 🔹 SHOW DASHBOARD
function showDashboard(){
  document.getElementById("dashboard-section").style.display = "block";
  document.getElementById("welcome-text").innerText =
    "Welcome, " + currentUser.displayName;
}


// 🔹 LOGOUT
function logoutUser(){
  auth.signOut().then(()=>{
    window.location.href = window.location.pathname;
  });
}
