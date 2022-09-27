// Import the functions you need from the SDKs you need https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

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
const db = getFirestore(app);

export function returnAuth(){
    return auth
}

// Create new user with email, password and set display name
export async function createNewUser(email: string, password: string, name: string){
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        await updateDisplayName(name, user)
        const uid = auth.currentUser?.uid
        console.log(uid != undefined)
        if(uid != undefined){
            try {
                await setDoc(doc(db, `data/${uid}`), {
                    data: {holidays: {}}
                });
            } catch (error) {
                console.log(error)    
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export async function signInUser(email: string, password: string){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
    });
}

export async function signOutUser(){
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        console.log(error)
        // An error happened.
    });
}

export async function updateDisplayName(name: string, user: User){
    updateProfile(user, {
        displayName: name
    }).then(() => {
        // Profile updated!
        return true
    }).catch((error) => {
        console.log(error)
    });
}