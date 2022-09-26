// Import the functions you need from the SDKs you need https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut  } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBFxqrFmRqBvQgfm0TK97m4bPsFGh5z1YY",
    authDomain: "holidayer-dd285.firebaseapp.com",
    projectId: "holidayer-dd285",
    storageBucket: "holidayer-dd285.appspot.com",
    messagingSenderId: "282609871014",
    appId: "1:282609871014:web:fe79e2e787eccb444eac67",
    measurementId: "G-XN9G0EF6B1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export function returnAuth(){
    return auth
}

// Create new user with email, password and set display name
export function createNewUser(email: string, password: string, name: string){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
            displayName: name
        }).then(() => {
            // Profile updated!
        }).catch((error) => {
            // Error
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

export function signInUser(email: string, password: string){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

export function signOutUser(){
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}