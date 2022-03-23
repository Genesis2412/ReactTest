import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, fetchSignInMethodsForEmail, signOut } from "firebase/auth";
import { auth } from "../firebase-config";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  // login
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function checkSignIn(email) {
    return fetchSignInMethodsForEmail(auth, email);
  }
  function logOut() {
    return signOut(auth);
  }

  // signup
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <userAuthContext.Provider value={{ user, logIn, signUp, logOut, resetPassword, checkSignIn }}>{children}</userAuthContext.Provider>;
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
