import { db } from '../config/Firebase';
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

    let barCrawlData: any = {
      userID,
      selectedBars: updatedSelectedBars,
      crawlName,
      intimacyLevel,
      attendees: finalAttendees,
    };

    if (startDate) {
      barCrawlData.startDate = startDate instanceof Date ? startDate : new Date(startDate);
    }

    if (endDate) {
      barCrawlData.endDate = endDate instanceof Date ? endDate : new Date(endDate);
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
    const snapshot = await db
      .collection("BarCrawls")
      .where("userID", "==", userID)
      .get();

    const barCrawls: BarCrawlInfo[] = snapshot.docs.map(doc => ({      
      ...(doc.data() as BarCrawlInfo),
      id: doc.id,
    }));

    return barCrawls;
  } catch (error) {
    console.error('Error fetching user bar crawls:', error);
    throw new Error('Error fetching user bar crawls');
  }
};

