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
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [userCar, setUserCar] = useState(null);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).finally(() => {
      setLoading(false);
    });
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).finally(() => {
      setLoading(false); // Keep for action feedback
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
    return signOut(auth).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      // console.log("Auth state changed, user:", currentUser?.email);

      if (currentUser?.email) {
        // STEP 2: Set loading true when starting data fetch for a logged-in user
        setLoading(true);
        fetch(`http://localhost:5000/users?email=${currentUser.email}`)
          .then((res) => {
            if (!res.ok) throw new Error(`User fetch failed: ${res.status}`);
            return res.json();
          })
          .then((userData) => {
            setMongoUser(userData);
            return fetch(
              `http://localhost:5000/carsByEmail?email=${currentUser.email}`
            );
          })
          .then((res) => {
            if (!res.ok) throw new Error(`Car fetch failed: ${res.status}`);
            return res.json();
          })
          .then((carData) => {
            // console.log("Fetched car data:", carData); // Debug log
            setUserCar(carData);
            //STEP 3: Set loading false AFTER all data is fetched successfully
            setLoading(false);
          })
          .catch((err) => {
            console.error("Data fetch error:", err);
            setMongoUser(null); // Reset data on error
            setUserCar(null);
            // STEP 4: Set loading false even if there's an error
            setLoading(false);
          });
      } else {
        // No user is logged in or user logged out
        console.log("No user logged in or logged out."); // Debug log
        setMongoUser(null);
        setUserCar(null);
        //  STEP 5: Set loading false because the auth check is complete (no user)
        setLoading(false);
      }
    });

    // Cleanup function
    return () => {
      console.log("Unsubscribing from auth state changes."); // Debug log
      unsubscribe();
    };
  }, []);
  const authValue = {
    firebaseUser,
    setFirebaseUser,
    mongoUser,
    createUser,
    signInUser,
    loginWithGoogle,
    logOut,
    userCar,
    loading,
  };
  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
