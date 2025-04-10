import { db } from '../config/Firebase';
import { BarCrawlInfo } from '../types/globalTypes';

export const saveBarCrawl = async ({
  userID,
  selectedBars,
  crawlName,
  startDate,
  endDate,
  intimacyLevel
}: BarCrawlInfo): Promise<void> => {
  try {
    const updatedSelectedBars = selectedBars.map(bar => {
      const barLat = bar.geometry.location.lat();
      const barLng = bar.geometry.location.lng(); 

      const updatedGeometry = {
        location: {
          lat: barLat, 
          lng: barLng  
        }
      };

      return { ...bar, geometry: updatedGeometry }; 
    });

    const barCrawlData: any = {
        userID,
        selectedBars: updatedSelectedBars,
        crawlName,
        intimacyLevel,
      };
      
      if (startDate) {
        barCrawlData.startDate = startDate instanceof Date ? startDate : new Date(startDate); 
      }
      
      if (endDate) {
        barCrawlData.endDate = endDate instanceof Date ? endDate : new Date(endDate); 
      }

    console.log(barCrawlData);
    await db.collection('BarCrawls').add(barCrawlData); 
  } catch (error) {
    console.error('Error saving bar crawl:', error);
    throw new Error('Error saving bar crawl');
  }
};
