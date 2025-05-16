import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import axios from "axios";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  linkWithCredential,
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

      if (currentUser?.email) {
        setLoading(true);

        // Step 1: Set JWT cookie
        axios
          .post(
            "http://localhost:5000/jwt",
            { email: currentUser.email },
            { withCredentials: true }
          )
          .then(() => {
            // Step 2: Fetch MongoDB user
            return axios.get("http://localhost:5000/users", {
              params: { email: currentUser.email },
              withCredentials: true,
            });
          })
          .then((res) => {
            setMongoUser(res.data);

            // Step 3: Fetch user cars (protected route)
            return axios.get(
              `http://localhost:5000/carsByEmail/${currentUser.email}`,
              {
                withCredentials: true,
              }
            );
          })
          .then((res) => {
            setUserCar(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Data fetch error:", err);
            setMongoUser(null);
            setUserCar(null);
            setLoading(false);
          });
      } else {
        console.log("No user logged in or logged out.");
        setMongoUser(null);
        setUserCar(null);
        setLoading(false);
      }
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
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
