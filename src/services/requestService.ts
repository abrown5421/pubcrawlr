import {
    doc,
    getDoc,
    updateDoc
  } from "firebase/firestore";
  import { db } from "../config/Firebase"; 
  
  export async function getAllUnseen(userToken: string): Promise<number> {
    try {
      const userDocRef = doc(db, "Friends", userToken);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.warn(`No document found in Friends collection with ID: ${userToken}`);
        return 0;
      }
  
      const data = userDocSnap.data();
      const friendsArray = data?.FriendsArray || [];
  
      const unseenCount = friendsArray.reduce((count: number, friend: any) => {
        return !friend.Seen ? count + 1 : count;
      }, 0);
  
      return unseenCount;
    } catch (error) {
      console.error("Error fetching unseen notifications:", error);
      return 0;
    }
  }

  export async function markAllUnseenAsSeen(userToken: string): Promise<boolean> {
    try {
      const userDocRef = doc(db, "Friends", userToken);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.warn(`No document found in Friends collection with ID: ${userToken}`);
        return false;
      }
  
      const data = userDocSnap.data();
      const friendsArray = data?.FriendsArray || [];
  
      const updatedArray = friendsArray.map((friend: any) => {
        if (!friend.Seen) {
          return { ...friend, Seen: true };
        }
        return friend;
      });
  
      await updateDoc(userDocRef, {
        FriendsArray: updatedArray
      });
  
      return true;
    } catch (error) {
      console.error("Error updating seen statuses:", error);
      return false;
    }
  }