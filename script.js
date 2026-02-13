// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWsAx0o5OnNvgxZDtg3JQR_7Cp_pQKdp0",
  authDomain: "hisacade.firebaseapp.com",
  projectId: "hisacade",
  storageBucket: "hisacade.firebasestorage.app",
  messagingSenderId: "148271520741",
  appId: "1:148271520741:web:5fce8f04c325d59601ed0c",
  measurementId: "G-P8CEG70MTG"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

/* SAVE DETAILS */
function saveDetails() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) {
    alert("Fill all details");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("phone", phone);

  document.getElementById("details-section").style.display="none";
  document.getElementById("login-section").style.display="block";
}

/* LOGIN */
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

/* AUTH STATE */
auth.onAuthStateChanged(async (user) => {

  if (!user) return;

  currentUser = user;
  const email = user.email;

  const userRef = db.collection("users").doc(email);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      name: localStorage.getItem("name"),
      phone: localStorage.getItem("phone"),
      paid: false
    });
    showCourse();
    return;
  }

  if (doc.data().paid === true) {
    showDashboard();
  } else {
    showCourse();
  }

});

/* COURSE */
function showCourse() {
  document.getElementById("login-section").style.display="none";
  document.getElementById("course-section").style.display="block";
}

/* DASHBOARD */
async function showDashboard() {

  document.getElementById("course-section").style.display="none";
  document.getElementById("dashboard-section").style.display="block";

  document.getElementById("welcome-text").innerText =
    "Welcome, " + currentUser.displayName;

  document.getElementById("profile-name").innerText =
    "Name: " + currentUser.displayName;

  document.getElementById("profile-email").innerText =
    "Email: " + currentUser.email;

  document.getElementById("profile-phone").innerText =
    "Phone: " + (localStorage.getItem("phone") || "");

  loadCourseData();
  loadVideos();
  loadDailyMessage();
  startCountdown();
}

/* LOAD COURSE */
async function loadCourseData() {
  const doc = await db.collection("course").doc("main").get();
  if(doc.exists){
    document.getElementById("class-time").innerText =
      doc.data().classTime;

    document.getElementById("live-frame").src =
      doc.data().liveLink;
  }
}

/* LOAD VIDEOS */
async function loadVideos() {
  const snapshot = await db.collection("videos").get();
  let html = "";

  snapshot.forEach(doc => {
    html += `
      <p>${doc.data().title}</p>
      <iframe src="${doc.data().link}"></iframe>
    `;
  });

  document.getElementById("video-list").innerHTML = html;
}

/* DAILY MESSAGE */
async function loadDailyMessage(){
  const doc = await db.collection("adminContent").doc("main").get();
  if(doc.exists){
    document.getElementById("daily-message").innerText =
      doc.data().dailyMessage;
  }
}

/* COUNTDOWN */
function startCountdown(){
  const examDate = new Date("March 18, 2025 00:00:00").getTime();

  setInterval(function(){
    const now = new Date().getTime();
    const diff = examDate - now;

    if(diff > 0){
      const days = Math.floor(diff/(1000*60*60*24));
      document.getElementById("exam-countdown").innerText =
        "SSLC Exam in " + days + " days";
    }
  },1000);
}

/* PAYMENT (Placeholder) */
function startPayment() {
  alert("Payment integration later");
}

/* LOGOUT */
function logoutUser() {
  auth.signOut().then(() => {
    location.reload();
  });
}

