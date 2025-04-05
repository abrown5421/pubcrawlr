import { doc, getDoc } from 'firebase/firestore';
import { User } from '../store/slices/authenticationSlice';
import { db } from '../config/Firebase';

export const getUserDataFromId = async (uid: string): Promise<User | null> => {
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as User;
    } else {
        return null;
    }
};