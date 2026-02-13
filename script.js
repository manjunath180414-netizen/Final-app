// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBWsAx0o5OnNvgxZDtg3JQR_7Cp_pQKdp0",
  authDomain: "hisacade.firebaseapp.com",
  projectId: "hisacade"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// 🔐 WAIT FOR LOGIN
auth.onAuthStateChanged((user) => {

  if (!user) {
    console.log("No user logged in");
    return;
  }

  console.log("User logged in:", user.email);

  document.getElementById("welcome-text").innerText =
    "Welcome, " + user.displayName;

  document.getElementById("profile-name").innerText =
    "Name: " + user.displayName;

  document.getElementById("profile-email").innerText =
    "Email: " + user.email;

  loadDashboard();
});


// 📊 LOAD DASHBOARD DATA
async function loadDashboard() {

  const doc = await db.collection("adminContent").doc("main").get();

  if (!doc.exists) {
    console.log("adminContent/main not found");
    return;
  }

  const data = doc.data();

  // Today time
  document.getElementById("today-time").innerText =
    data.todayTime || "";

  // Daily message
  document.getElementById("daily-message").innerText =
    data.dailyMessage || "";

  // Countdown
  if (data.examDate) {
    startCountdown(data.examDate);
  }

  // Live class
  const liveLink = data.liveLink || "";

  if (liveLink && liveLink.includes("youtube")) {
    document.getElementById("live-container").innerHTML =
      `<iframe src="${liveLink}" allowfullscreen></iframe>`;
  } else {
    document.getElementById("live-container").innerHTML =
      `<p>Live will start soon ⏳</p>`;
  }

  loadMotivations();
  loadRecorded();
}


// ⏳ COUNTDOWN FUNCTION
function startCountdown(dateStr) {

  const examDate = new Date(dateStr).getTime();

  setInterval(() => {

    const now = new Date().getTime();
    const diff = examDate - now;

    if (diff > 0) {

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      document.getElementById("countdown").innerText =
        "⏳ " + days + " Days " + hours + " Hours left for Exam";
    }

  }, 1000);
}


// 🖼 LOAD MOTIVATION IMAGES
async function loadMotivations() {

  const snapshot = await db.collection("motivations").get();

  console.log("Motivations count:", snapshot.size);

  const images = [];

  snapshot.forEach(doc => {
    const url = doc.data().imageUrl;
    if (url) images.push(url);
  });

  if (images.length === 0) {
    console.log("No motivation images found");
    return;
  }

  let index = 0;

  document.getElementById("motivation-img").src = images[0];

  setInterval(() => {
    index = (index + 1) % images.length;
    document.getElementById("motivation-img").src = images[index];
  }, 3000);
}


// 🎥 LOAD RECORDED VIDEOS
async function loadRecorded() {

  const snapshot = await db.collection("videos").get();

  let html = "";

  snapshot.forEach(doc => {
    const title = doc.data().title;
    const link = doc.data().link;

    html += `
      <p>${title}</p>
      <iframe src="${link}" allowfullscreen></iframe>
    `;
  });

  document.getElementById("recorded-container").innerHTML = html;
}


// 📞 CALL BUTTON
function callSir() {
  window.location.href = "tel:+917022322709";
}


// 🚪 LOGOUT
function logoutUser() {
  auth.signOut().then(() => {
    location.reload();
  });
}
