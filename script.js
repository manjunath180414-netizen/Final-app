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

function hideAll(){
  document.getElementById("details-section").style.display = "none";
  document.getElementById("login-section").style.display = "none";
  document.getElementById("course-section").style.display = "none";
  document.getElementById("dashboard-section").style.display = "none";
}

function saveDetails(){
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if(!name || !phone){
    alert("Fill all details");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("phone", phone);

  hideAll();
  document.getElementById("login-section").style.display = "block";
}

function googleLogin(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(()=> {
      console.log("Login successful");
    })
    .catch(error=>{
      alert(error.message);
    });
}

auth.onAuthStateChanged(async(user)=>{

  hideAll();

  if(!user){
    document.getElementById("details-section").style.display = "block";
    return;
  }

  currentUser = user;
  const email = user.email;
  const userRef = db.collection("users").doc(email);
  const doc = await userRef.get();

  if(!doc.exists){
    await userRef.set({
      name: localStorage.getItem("name") || user.displayName,
      phone: localStorage.getItem("phone") || "",
      paid: false
    });
  }

  const updatedDoc = await userRef.get();

  if(updatedDoc.data().paid === true){
    document.getElementById("dashboard-section").style.display = "block";
  } else {
    document.getElementById("course-section").style.display = "block";
  }

});

function logoutUser(){
  auth.signOut().then(()=>{
    location.reload();
  });
}
