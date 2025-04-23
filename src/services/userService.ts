import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
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
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const searchUsersByName = async (input: string, currentUserId: string): Promise<User[]> => {
    const inputLower = input.toLowerCase();
    const usersRef = collection(db, 'Users');
    const usersSnap = await getDocs(usersRef);
  
    const scoredUsers: { user: User; score: number }[] = [];
  
    usersSnap.forEach((doc) => {
      if (doc.id === currentUserId) return;
  
      const user = { ...(doc.data() as User), docId: doc.id }; 
      const first = user.UserFirstName?.toLowerCase() || '';
      const last = user.UserLastName?.toLowerCase() || '';
      const full = `${first} ${last}`;
  
      let score = 0;
      if (first.startsWith(inputLower)) score += 10;
      if (last.startsWith(inputLower)) score += 5;
      if (full.includes(inputLower)) score += 3;
      if (first.includes(inputLower)) score += 2;
      if (last.includes(inputLower)) score += 1;
  
      if (score > 0) {
        scoredUsers.push({ user, score });
      }
    });
  
    scoredUsers.sort((a, b) => b.score - a.score);
    return scoredUsers.slice(0, 10).map((entry) => entry.user);
  };
  