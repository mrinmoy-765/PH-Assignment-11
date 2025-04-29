import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const AuthContext = createContext();

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);
 // const [mongoUser, setMongoUser] = useState(null);


  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      //fetch user details from mongoDB
      if (user?.email) {
        fetch(`http://localhost:5000/users?email=${user.email}`)
          .then((res) => res.json())
          .then((data) => {
            setMongoUser(data);
            
          })
          .catch((err) => {
            console.error("MongoDB user fetch error:", err);
            setLoading(false);
          });
      } else {
        setMongoUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authValue = {
    firebaseUser,
    setFirebaseUser,
    // mongoUser,
    createUser,
    signInUser,
    logOut,
    loading,
  };
  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;