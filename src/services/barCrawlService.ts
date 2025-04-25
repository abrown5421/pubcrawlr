import { db } from '../config/Firebase';
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { BarCrawlInfo, Attendee } from '../types/globalTypes';

const sanitizeUndefined = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        value === undefined ? null : sanitizeUndefined(value)
      ])
    );
  }
  return obj;
};

export const deleteBarCrawl = async (id: string): Promise<void> => {
  try {
    await db.collection('BarCrawls').doc(id).delete();
    console.log(`BarCrawl with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting BarCrawl:', error);
  }
};

const ensureCreatorInAttendees = (attendees: any, userID: string | null): Attendee[] => {
  const validAttendees = Array.isArray(attendees) ? attendees : [];
  const creator: Attendee = {
    docId: userID,
    UserFirstName: null,
    UserLastName: null,
    invited: false,
    attending: true,
    creator: true
  };

  const isCreatorIncluded = validAttendees.some(a => a.docId === userID);
  return isCreatorIncluded ? validAttendees : [creator, ...validAttendees];
};

export const saveBarCrawl = async ({
  userID,
  selectedBars,
  crawlName,
  startDate,
  endDate,
  intimacyLevel,
  attendees, 
}: BarCrawlInfo): Promise<void> => {
  try {
    const updatedSelectedBars = selectedBars.map(bar => {
      const barLat = bar.geometry.location.lat;
      const barLng = bar.geometry.location.lng;

      const updatedGeometry = {
        location: {
          lat: barLat,
          lng: barLng,
        },
      };

      return sanitizeUndefined({ ...bar, geometry: updatedGeometry });
    });

    const finalAttendees = ensureCreatorInAttendees(attendees, userID);
    const attendeeIds = finalAttendees.map(a => a.docId).filter(Boolean);

    let barCrawlData: any = {
      userID,
      selectedBars: updatedSelectedBars,
      crawlName,
      intimacyLevel,
      attendees: finalAttendees,
      attendeeIds,
    };

    if (startDate) {
      barCrawlData.startDate = startDate;
    }
    
    if (endDate) {
      barCrawlData.endDate = endDate;
    }    

    barCrawlData = sanitizeUndefined(barCrawlData);
    await db.collection('BarCrawls').add(barCrawlData);
  } catch (error) {
    console.error('Error saving bar crawl:', error);
    throw new Error('Error saving bar crawl');
  }
};

export const getBarCrawlByID = async (id: string): Promise<BarCrawlInfo | null> => {
  try {
    const docRef = db.collection('BarCrawls').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.warn(`BarCrawl with ID ${id} does not exist.`);
      return null;
    }

    const data = doc.data() as BarCrawlInfo;
    return {
      ...data,
      id: doc.id,
    };
  } catch (error) {
    console.error('Error fetching BarCrawl by ID:', error);
    throw new Error('Error fetching BarCrawl by ID');
  }
};

export const getUserBarCrawls = async (userID: string): Promise<BarCrawlInfo[]> => {
  try {
    const dbRef = db.collection("BarCrawls");
    const creatorSnap = await dbRef.where("userID", "==", userID).get();
    const createdCrawls = creatorSnap.docs.map(doc => ({
      ...(doc.data() as BarCrawlInfo),
      id: doc.id,
    }));

    const attendeeSnap = await dbRef.where("attendeeIds", "array-contains", userID).get();
    const attendingCrawls = attendeeSnap.docs
      .filter(doc => {
        const data = doc.data() as BarCrawlInfo;
        return (
          Array.isArray(data.attendees) &&
          data.attendees.some(att => att.docId === userID && att.attending === true)
        );
      })
      .map(doc => ({
        ...(doc.data() as BarCrawlInfo),
        id: doc.id,
      }));

    const allCrawlsMap = new Map<string, BarCrawlInfo>();
    [...createdCrawls, ...attendingCrawls].forEach(crawl => {
      allCrawlsMap.set(crawl.id, crawl);
    });

    return Array.from(allCrawlsMap.values());
  } catch (error) {
    console.error('Error fetching user bar crawls:', error);
    throw new Error('Error fetching user bar crawls');
  }
};

export const getUserInvitedBarCrawls = async (userID: string): Promise<BarCrawlInfo[]> => {
  try {
    const snapshot = await db
      .collection("BarCrawls")
      .where("attendeeIds", "array-contains", userID)
      .get();

    const barCrawls: BarCrawlInfo[] = snapshot.docs
      .map(doc => ({
        ...(doc.data() as BarCrawlInfo),
        id: doc.id,
      }))
      .filter(barCrawl => {
        const userAttendee = Array.isArray(barCrawl.attendees)
          ? barCrawl.attendees.find((att: Attendee) => att.docId === userID)
          : undefined;
      
        return userAttendee && userAttendee.attending !== true;
      });

    return barCrawls;
  } catch (error) {
    console.error('Error fetching user invited bar crawls:', error);
    throw new Error('Error fetching user invited bar crawls');
  }
};

export const markUserAsAttending = async (barCrawlId: string, userId: string): Promise<void> => {
  try {
    const barCrawl = await getBarCrawlByID(barCrawlId);
    if (!barCrawl) {
      console.warn(`Bar crawl with ID ${barCrawlId} not found.`);
      return;
    }

    if (!Array.isArray(barCrawl.attendees)) {
      console.warn(`Attendees for BarCrawl ${barCrawlId} is not an array.`);
      return;
    }

    const updatedAttendees = barCrawl.attendees.map((attendee: Attendee) => {
      if (attendee.docId === userId) {
        return { ...attendee, attending: true };
      }
      return attendee;
    });

    await db.collection('BarCrawls').doc(barCrawlId).update({
      attendees: updatedAttendees,
    });

    console.log(`User ${userId} marked as attending for BarCrawl ${barCrawlId}`);
  } catch (error) {
    console.error('Error marking user as attending:', error);
    throw new Error('Error marking user as attending');
  }
};

export const declineBarCrawlInvite = async (barCrawlId: string, userId: string): Promise<void> => {
  try {
    const barCrawl = await getBarCrawlByID(barCrawlId);
    if (!barCrawl) {
      console.warn(`Bar crawl with ID ${barCrawlId} not found.`);
      return;
    }

    if (!Array.isArray(barCrawl.attendees)) {
      console.warn(`Attendees for BarCrawl ${barCrawlId} is not an array.`);
      return;
    }

    const updatedAttendees = barCrawl.attendees.filter(
      (attendee: Attendee) => attendee.docId !== userId
    );

    const updatedAttendeeIds = Array.isArray(barCrawl.attendeeIds)
      ? barCrawl.attendeeIds.filter((id: string) => id !== userId)
      : [];

    await db.collection('BarCrawls').doc(barCrawlId).update({
      attendees: updatedAttendees,
      attendeeIds: updatedAttendeeIds,
    });

    console.log(`User ${userId} removed from invite list for BarCrawl ${barCrawlId}`);
  } catch (error) {
    console.error('Error declining bar crawl invite:', error);
    throw new Error('Error declining bar crawl invite');
  }
};

export function subscribeToBarCrawls(callback: (crawls: BarCrawlInfo[]) => void) {
  const barCrawlsCollectionRef = collection(db, "BarCrawls");

  return onSnapshot(barCrawlsCollectionRef, (querySnapshot) => {
    const crawls: BarCrawlInfo[] = [];
    querySnapshot.forEach((doc) => {
      crawls.push(doc.data() as BarCrawlInfo);
    });
    callback(crawls);
  });
}


