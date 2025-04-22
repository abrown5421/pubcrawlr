import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    onSnapshot,
  } from "firebase/firestore";
  import { db } from "../config/Firebase"; 
  import { FriendEntry } from "../types/globalTypes";
  
  const FRIENDS_COLLECTION = "friends";
  
  export async function requestFriend(currentUserId: string, friend: FriendEntry) {
    const currentUserDocRef = doc(db, FRIENDS_COLLECTION, currentUserId);
  
    const friendEntry: FriendEntry = {
      ...friend,
      FriendRequested: true,
      FriendRequestAccepted: false,
      DateRequested: new Date().toISOString(),
    };
  
    await setDoc(
      currentUserDocRef,
      { FriendsArray: arrayUnion(friendEntry) },
      { merge: true }
    );
  }
  
  export async function acceptFriendRequest(currentUserId: string, friendDocId: string) {
    const currentUserDocRef = doc(db, FRIENDS_COLLECTION, currentUserId);
    const currentUserDoc = await getDoc(currentUserDocRef);
  
    if (currentUserDoc.exists()) {
      const friendsArray = currentUserDoc.data()?.FriendsArray || [];
      const updatedArray = friendsArray.map((f: FriendEntry) =>
        f.FriendDocId === friendDocId
          ? { ...f, FriendRequestAccepted: true }
          : f
      );
      await updateDoc(currentUserDocRef, { FriendsArray: updatedArray });
    }
  }
  
  export async function rescindFriendRequest(currentUserId: string, friendDocId: string) {
    const currentUserDocRef = doc(db, FRIENDS_COLLECTION, currentUserId);
    const currentUserDoc = await getDoc(currentUserDocRef);
  
    if (currentUserDoc.exists()) {
      const friendsArray = currentUserDoc.data()?.FriendsArray || [];
      const updatedArray = friendsArray.filter((f: FriendEntry) => f.FriendDocId !== friendDocId);
      await updateDoc(currentUserDocRef, { FriendsArray: updatedArray });
    }
  }
  
  export async function removeFriend(currentUserId: string, friendDocId: string) {
    const currentUserDocRef = doc(db, FRIENDS_COLLECTION, currentUserId);
    const currentUserDoc = await getDoc(currentUserDocRef);
  
    if (currentUserDoc.exists()) {
      const friendsArray = currentUserDoc.data()?.FriendsArray || [];
      const updatedArray = friendsArray.filter((f: FriendEntry) => f.FriendDocId !== friendDocId);
      await updateDoc(currentUserDocRef, { FriendsArray: updatedArray });
    }
  
    const otherUserDocRef = doc(db, FRIENDS_COLLECTION, friendDocId);
    const otherUserDoc = await getDoc(otherUserDocRef);
  
    if (otherUserDoc.exists()) {
      const friendsArray = otherUserDoc.data()?.FriendsArray || [];
      const updatedArray = friendsArray.filter((f: FriendEntry) => f.FriendDocId !== currentUserId);
      await updateDoc(otherUserDocRef, { FriendsArray: updatedArray });
    }
  }
  
  export async function getFriends(userId: string): Promise<FriendEntry[]> {
    const userDocRef = doc(db, FRIENDS_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data()?.FriendsArray || [] : [];
  }
  
  export async function isAlreadyFriend(userId: string, friendDocId: string): Promise<boolean> {
    const friends = await getFriends(userId);
    return friends.some((f: FriendEntry) => f.FriendDocId === friendDocId);
  }
  
  export function subscribeToFriends(userId: string, callback: (friends: FriendEntry[]) => void) {
    const userDocRef = doc(db, FRIENDS_COLLECTION, userId);
    return onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback(data?.FriendsArray || []);
      } else {
        callback([]);
      }
    });
  }
  