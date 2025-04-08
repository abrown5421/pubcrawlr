import React from "react";
import { Place } from "../store/slices/localBarSlice"; 

type BarCardProps = {
  bar: Place;  
};

const BarCard: React.FC<BarCardProps> = ({ bar }) => {
  return (
    <div className="bar-card">
      <h3>{bar.name}</h3>
      <p>{bar.vicinity}</p>
      {bar.rating && <p>Rating: {bar.rating}</p>}
    </div>
  );
};

export default BarCard;
