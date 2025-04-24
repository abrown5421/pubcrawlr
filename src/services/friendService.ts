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
  
  export async function requestFriend(currentUserId: string, requester: FriendEntry, requestee: FriendEntry) {
    const requesterDocRef = doc(db, "Friends", currentUserId);
    const requesteeDocRef = doc(db, "Friends", requester.FriendDocId);
  
    const requesterEntry: FriendEntry = {
      ...requester,
      FriendRequested: true,
      FriendRequestAccepted: false,
      DateRequested: new Date().toISOString(),
      Seen: true,
    };

    const requesteeEntry: FriendEntry = {
      ...requestee,
      FriendRequested: false,
      FriendRequestAccepted: true,
      DateRequested: new Date().toISOString(),
      Seen: false,
    };

    const requesterDocSnap = await getDoc(requesterDocRef);
    if (!requesterDocSnap.exists()) {
        await setDoc(requesterDocRef, { FriendsArray: [requesterEntry] });
    } else {
        await setDoc(
            requesterDocRef,
            { FriendsArray: arrayUnion(requesterEntry) },
            { merge: true }
        );
    }

    const requesteeDocSnap = await getDoc(requesteeDocRef);
    if (!requesteeDocSnap.exists()) {
        await setDoc(requesteeDocRef, { FriendsArray: [requesteeEntry] });
    } else {
        await setDoc(
            requesteeDocRef,
            { FriendsArray: arrayUnion(requesteeEntry) },
            { merge: true }
        );
    }
  }
  
  export async function acceptFriendRequest(currentUserId: string, friendDocId: string) {
    const currentUserDocRef = doc(db, "Friends", currentUserId);
    const friendUserDocRef = doc(db, "Friends", friendDocId);
  
    const currentUserDoc = await getDoc(currentUserDocRef);
    const friendUserDoc = await getDoc(friendUserDocRef);
  
    if (currentUserDoc.exists() && friendUserDoc.exists()) {
      const currentUserFriends: FriendEntry[] = currentUserDoc.data()?.FriendsArray || [];
      const friendUserFriends: FriendEntry[] = friendUserDoc.data()?.FriendsArray || [];
  
      const updatedCurrentUserFriends = currentUserFriends.map((f) =>
        f.FriendDocId === friendDocId ? { ...f, FriendRequested: true } : f
      );
  
      const updatedFriendUserFriends = friendUserFriends.map((f) =>
        f.FriendDocId === currentUserId ? { ...f, FriendRequestAccepted: true } : f
      );
  
      await Promise.all([
        updateDoc(currentUserDocRef, { FriendsArray: updatedCurrentUserFriends }),
        updateDoc(friendUserDocRef, { FriendsArray: updatedFriendUserFriends })
      ]);
    }
  }
  
  export async function removeFriend(currentUserId: string, friendDocId: string) {
    const currentUserDocRef = doc(db, "Friends", currentUserId);
    const currentUserDoc = await getDoc(currentUserDocRef);
  
    if (currentUserDoc.exists()) {
      const friendsArray = currentUserDoc.data()?.FriendsArray || [];
      const updatedArray = friendsArray.filter((f: FriendEntry) => f.FriendDocId !== friendDocId);
      await updateDoc(currentUserDocRef, { FriendsArray: updatedArray });
    }
  
    const otherUserDocRef = doc(db, "Friends", friendDocId);
    const otherUserDoc = await getDoc(otherUserDocRef);
  
    if (otherUserDoc.exists()) {
      const friendsArray = otherUserDoc.data()?.FriendsArray || [];
      const updatedArray = friendsArray.filter((f: FriendEntry) => f.FriendDocId !== currentUserId);
      await updateDoc(otherUserDocRef, { FriendsArray: updatedArray });
    }
  }
  
  export async function getFriends(userId: string): Promise<FriendEntry[]> {
    const userDocRef = doc(db, "Friends", userId);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data()?.FriendsArray || [] : [];
  }
  
  export async function isAlreadyFriend(userId: string, friendDocId: string): Promise<boolean> {
    const friends = await getFriends(userId);
    return friends.some((f: FriendEntry) => f.FriendDocId === friendDocId);
  }
  
  export function subscribeToFriends(userId: string, callback: (friends: FriendEntry[]) => void) {
    const userDocRef = doc(db, "Friends", userId);
    return onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback(data?.FriendsArray || []);
      } else {
        callback([]);
      }
    });
  }
  