import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from '../types/globalTypes';
import { db, auth } from '../config/Firebase';
import { updateEmail } from 'firebase/auth';

export const getUserDataFromId = async (uid: string): Promise<User | null> => {
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as User;
    } else {
        return null;
    }
};

export const updateUserData = async (
    uid: string,
    firstName: string,
    lastName: string,
    email: string
): Promise<void> => {
    try {
        const userDocRef = doc(db, 'Users', uid);
        await updateDoc(userDocRef, {
            UserFirstName: firstName,
            UserLastName: lastName,
            UserEmail: email,
        });

        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === uid) {
            await updateEmail(currentUser, email);
        } else {
            console.warn('No matching authenticated user for email update.');
        }

        console.log(`User ${uid} updated successfully.`);
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};