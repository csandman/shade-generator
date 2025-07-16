import { createContext, useContext } from 'react';
import app from 'firebase/app';
import 'firebase/firestore';
// import 'firebase/auth'; // Do later

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    if (navigator && navigator.onLine) {
      app.initializeApp(config);

      // DB setup
      this.db = app.firestore();
      // Add Google Login here
      // this.auth = app.auth();
    }
  }

  // doCreateUserWithEmailAndPassword = (email, password) =>
  //   this.auth.createUserWithEmailAndPassword(email, password);

  // doSignInWithEmailAndPassword = (email, password) =>
  //   this.auth.signInWithEmailAndPassword(email, password);

  // doSignOut = () => this.auth.signOut();

  // doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  // doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  colorHistory = () => this.db.collection('color-history');

  aggRef = () => this.db.collection('aggregation').doc('all');
}

const FirebaseContext = createContext({
  firebase: {},
});

const firebase = new Firebase();

const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};

const useFirebase = () => {
  return useContext(FirebaseContext);
};

export { FirebaseContext as default, FirebaseProvider, useFirebase };
