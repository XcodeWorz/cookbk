import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBayyFvRbZt6Zs14lctTDLdCWo31MalCdk",
  authDomain: "cookbook-aba4f.firebaseapp.com",
  databaseURL: "https://cookbook-aba4f.firebaseio.com",
  projectId: "cookbook-aba4f",
  storageBucket: "cookbook-aba4f.appspot.com",
  messagingSenderId: "1027620248417"
};
firebase.initializeApp(config);

export const auth = firebase.auth();
export const database = firebase.database();
export const provider = new firebase.auth.GoogleAuthProvider;
export default firebase;