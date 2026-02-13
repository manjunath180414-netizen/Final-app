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

/* GOOGLE LOGIN */
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
}

/* AUTH CHECK */
auth.onAuthStateChanged(async (user) => {

  hideAll();

  if (!user) {
    document.getElementById("details-section").style.display="block";
    return;
  }

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
    document.getElementById("course-section").style.display="block";
    return;
  }

  if (doc.data().paid === true) {
    showDashboard();
  } else {
    document.getElementById("course-section").style.display="block";
  }
});

/* HIDE ALL */
function hideAll() {
  document.getElementById("details-section").style.display="none";
  document.getElementById("login-section").style.display="none";
  document.getElementById("course-section").style.display="none";
  document.getElementById("activation-section").style.display="none";
  document.getElementById("dashboard-section").style.display="none";
}

/* PAYMENT */
function startPayment() {
  window.open("https://rzp.io/rzp/Ixa4luk");
  document.getElementById("course-section").style.display="none";
  document.getElementById("activation-section").style.display="block";
}

/* SOCIAL LINKS */
function openInstagram() {
  window.open("https://www.instagram.com/_hisacademy", "_blank");
}

function openYouTube() {
  window.open("https://youtube.com/@hisacademy-i4y", "_blank");
}

/* WHATSAPP MESSAGE */
function sendWhatsApp() {
  const name = localStorage.getItem("name");
  const phone = localStorage.getItem("phone");
  const email = currentUser.email;

  const message = `Hello HIS Academy,%0A%0AI have paid for the SSLC 2026 Crash Course.%0A%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email}%0A%0APlease activate my course.`;

  window.open(`https://wa.me/91YOURNUMBER?text=${message}`, "_blank");
}

/* DASHBOARD */
function showDashboard() {
  document.getElementById("dashboard-section").style.display="block";
  document.getElementById("welcome-text").innerText =
    "Welcome, " + currentUser.displayName;
}

/* LOGOUT */
function logoutUser() {
  auth.signOut().then(() => {
    location.reload();
  });
}

