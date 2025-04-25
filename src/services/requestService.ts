import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "../config/Firebase";

export async function getUnseenFriendRequests(userToken: string): Promise<number> {
  try {
    const userDocRef = doc(db, "Friends", userToken);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.warn(`No document found in Friends collection with ID: ${userToken}`);
      return 0;
    }

    const data = userDocSnap.data();
    const friendsArray = data?.FriendsArray || [];

    return friendsArray.reduce((count: number, friend: any) => {
      return !friend.Seen ? count + 1 : count;
    }, 0);
  } catch (error) {
    console.error("Error fetching unseen friend requests:", error);
    return 0;
  }
}

export async function getUnseenBarCrawlInvites(userToken: string): Promise<number> {
  try {
    const barCrawlsRef = collection(db, "BarCrawls");

    const q = query(barCrawlsRef, where("attendeeIds", "array-contains", userToken));
    const querySnapshot = await getDocs(q);

    let unseenCount = 0;

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const attendees = data.attendees || [];

      const userAttendee = attendees.find((att: any) => att.docId === userToken);

      if (userAttendee && userAttendee.invited && !userAttendee.seen) {
        unseenCount += 1;
      }
    });

    return unseenCount;
  } catch (error) {
    console.error("Error fetching unseen bar crawl invites:", error);
    return 0;
  }
}

export async function getAllUnseen(userToken: string): Promise<{
  friendRequests: number;
  barCrawlInvites: number;
  total: number;
}> {
  const [friendRequests, barCrawlInvites] = await Promise.all([
    getUnseenFriendRequests(userToken),
    getUnseenBarCrawlInvites(userToken)
  ]);

  return {
    friendRequests,
    barCrawlInvites,
    total: friendRequests + barCrawlInvites
  };
}

export async function markFriendRequestsAsSeen(userToken: string): Promise<void> {
  try {
    const userDocRef = doc(db, "Friends", userToken);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) return;

    const data = userDocSnap.data();
    const friendsArray = data?.FriendsArray || [];

    const updatedFriendsArray = friendsArray.map((friend: any) => ({
      ...friend,
      Seen: true,
    }));

    await updateDoc(userDocRef, { FriendsArray: updatedFriendsArray });
  } catch (error) {
    console.error("Error marking friend requests as seen:", error);
  }
}

export async function markBarCrawlInvitesAsSeen(userToken: string): Promise<void> {
  try {
    const barCrawlsRef = collection(db, "BarCrawls");
    const q = query(barCrawlsRef, where("attendeeIds", "array-contains", userToken));
    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const attendees = data.attendees || [];

      const updatedAttendees = attendees.map((attendee: any) =>
        attendee.docId === userToken && attendee.invited
          ? { ...attendee, seen: true }
          : attendee
      );

      const barCrawlRef = doc(db, "BarCrawls", docSnap.id);
      await updateDoc(barCrawlRef, { attendees: updatedAttendees });
    }
  } catch (error) {
    console.error("Error marking bar crawl invites as seen:", error);
  }
}