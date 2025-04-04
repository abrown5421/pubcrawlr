import { auth, db } from '../config/Firebase';
import firebase from 'firebase/compat/app';

const USERS_COLLECTION = 'Users';

const login = async (email: string, password: string) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      if (user) {
        const userDocRef = db.collection(USERS_COLLECTION).doc(user.uid);
        const userDoc = await userDocRef.get();
  
        if (userDoc.exists) {
          const userData = userDoc.data();
          return {
            UserEmail: userData?.UserEmail, 
            UserFirstName: userData?.UserFirstName, 
            UserLastName: userData?.UserLastName
          };
        } else {
          console.warn("No user document found in Firestore for UID:", user.uid);
          return {
            email: user.email,
          };
        }
      }
  
      return null;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
};
  

const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user) {
      const userDocRef = db.collection(USERS_COLLECTION).doc(user.uid);
      await userDocRef.set({
        CreateDate: firebase.firestore.FieldValue.serverTimestamp(),
        UserEmail: email,
        UserFirstName: firstName,
        UserLastName: lastName,
      });
    }

    return user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const getCurrentUser = () => {
  return auth.currentUser;
};

export default {
  login,
  logout,
  register,
  getCurrentUser
};
