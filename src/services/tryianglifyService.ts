import { db } from '../config/Firebase';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { TrianglifyState } from "../types/globalTypes"; 

export const saveTrianglifyConfig = async (userID: string, trianglifyState: TrianglifyState) => {
  try {
    const docRef = doc(db, "TrianglifyConfig", userID);
    
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, trianglifyState);
    } else {
      await setDoc(docRef, trianglifyState);
    }
  } catch (error) {
    console.error("Error saving/updating trianglify config:", error);
  }
};

export const fetchTrianglifyConfig = async (userID: string): Promise<TrianglifyState | null> => {
  try {
    const docRef = doc(db, "TrianglifyConfig", userID);
    
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as TrianglifyState;
    } else {
      console.log("No config found for this user.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching trianglify config:", error);
    return null;
  }
};