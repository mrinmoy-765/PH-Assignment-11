import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const AuthContext = createContext();

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  // const [mongoUser, setMongoUser] = useState(null);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).finally(() => {
      setLoading(false);
    });
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).finally(() => {
      setLoading(false);
    });
  };

  //sign in with google
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      //fetch user details from mongoDB
      // if (user?.email) {
      //   fetch(`http://localhost:5000/users?email=${user.email}`)
      //     .then((res) => res.json())
      //     .then((data) => {
      //       setMongoUser(data);

      //     })
      //     .catch((err) => {
      //       console.error("MongoDB user fetch error:", err);
      //       setLoading(false);
      //     });
      // } else {
      //   //setMongoUser(null);
      //   setLoading(false);
      // }
    });

    return () => unsubscribe();
  }, []);

  const authValue = {
    firebaseUser,
    setFirebaseUser,
    // mongoUser,
    createUser,
    signInUser,
    loginWithGoogle,
    logOut,
    loading,
  };
  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
