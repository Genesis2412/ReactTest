import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  signOut,
  sendEmailVerification,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase-config";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [classes, setClasses] = useState([]);
  const [bookingCount, setBookingCount] = useState(0);

  // login
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function verifyEmail(currentUser) {
    return sendEmailVerification(currentUser);
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

  function emailAuthProvider() {
    return EmailAuthProvider;
  }

  function reAuthenticateUserWithCredential(user, credential) {
    return reauthenticateWithCredential(user, credential);
  }

  function deleteAuthUser(user) {
    return deleteUser(user);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
        userDetails,
        setUser,
        setUserDetails,
        bookingCount,
        setBookingCount,
        classes,
        setClasses,
        logIn,
        signUp,
        logOut,
        resetPassword,
        verifyEmail,
        checkSignIn,
        emailAuthProvider,
        reAuthenticateUserWithCredential,
        deleteAuthUser,
      }}
    >
      {!loading && children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
