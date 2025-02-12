import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import {createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword,signOut,} from "firebase/auth";
import auth from '../firebase/firebase.config';
import createTreeFromUser from '../functions/createTreeFromUser';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trees, setTrees] = useState(null);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log('Current User: ', currentUser);
      if (currentUser) {
        // This function might be creating a tree record for the user.
        // After it's done, we set loading to false.
        createTreeFromUser(currentUser.uid).then(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
    return () => {
      unSubscribe();
    };
  }, []);

  // Include trees and setTrees in the context value
  const authInfo = { user, loading, trees, setTrees, createUser, signInUser, signOutUser };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
