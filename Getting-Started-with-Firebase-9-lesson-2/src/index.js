import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZZKtWSsFUZjg29gOxo8d7Yz9aehoeSeo",
  authDomain: "start-with-fire.firebaseapp.com",
  projectId: "start-with-fire",
  storageBucket: "start-with-fire.appspot.com",
  messagingSenderId: "46705142026",
  appId: "1:46705142026:web:919dd2a0886eb3f78672f3",
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// const db = firebase.firestore()
// db.collection('books')

// collection ref
const colRef = collection(db, "books");

// queries
const q = query(
  colRef,
  // where("author", "==", "patrick rothfuss"),
  orderBy("createdAt")
);

// real time collection data

// getDoc(colRef)
//   .then((snapshot) => {
//     console.log(snapshot.docs);
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

const unsubCol = onSnapshot(q, (snapshot) => {
  // console.log(snapshot.docs);
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// adding documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// deleting documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const docRef = doc(db, "books", deleteBookForm.id.value);
  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// get a single document
// (& realtime)
//
// getDoc(docRef).then((doc) => {
// console.log(doc.data(), doc.id);
// });

const docRef = doc(db, "books", "6RtFW0IGArBc7y1Gt5Ju");

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateForm.reset();
  });
});

// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log("user created:", cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // console.log(`the user signed out`);
    })
    .catch((err) => {
      console.log(err.message);
    });
});
const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log("user logged in:", cred.user);
    })
    .catch((err) => {
      console.log(err);
    });
});

// subscriding to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed :", user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");
  unsubCol();
  unsubDoc();
  unsubAuth();
});
