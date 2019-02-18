import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDsh0JvW6UTV6zkXuViEaoATm-gXTEkyd4",
    authDomain: "reacting-notes.firebaseapp.com",
    databaseURL: "https://reacting-notes.firebaseio.com",
    projectId: "reacting-notes",
    storageBucket: "reacting-notes.appspot.com",
    messagingSenderId: "236014799339"
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;