import React from "react";
import "../styles/components/BarCrawlCard.css";

type Bar = {
  id: string;
  name: string;
  photoUrl: string;
  price: number | null;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

type BarCrawl = {
  crawlName: string;
  intimacyLevel: string;
  userID: string;
  selectedBars: Bar[];
};

type BarCrawlCardProps = {
  crawl: BarCrawl;
};

const BarCrawlCard: React.FC<BarCrawlCardProps> = ({ crawl }) => {
  return (
    <div className="bar-crawl-card">
      <div className="bar-crawl-header">
        <h2>{crawl.crawlName}</h2>
        <p className="intimacy">{crawl.intimacyLevel}</p>
      </div>

      <div className="bar-list">
        {crawl.selectedBars.map((bar) => (
          <div key={bar.id} className="bar-item">
            <img src={bar.photoUrl} alt={bar.name} className="bar-image" />
            <div className="bar-details">
              <h3>{bar.name}</h3>
              <p>{bar.vicinity}</p>
              <p>⭐ {bar.rating} ({bar.user_ratings_total} reviews)</p>
              {bar.price !== null && <p>Price Level: {bar.price}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="button-group">
        <button className="edit-btn">Edit</button>
        <button className="delete-btn">Delete</button>
      </div>
    </div>
  );
};

export default BarCrawlCard;
