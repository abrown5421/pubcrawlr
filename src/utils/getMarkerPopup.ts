import { MarkerPopupProps } from "../types/globalTypes";

export function getMarkerPopup({
    
    name,
    includeAddBtn
}: MarkerPopupProps): string {
    return `<div style="display: flex; flex-direction: column; align-items: left;">
              
              <div style="font-weight: bold; font-size: 16px; margin: 8px;">
                ${name.length > 38 ? `${name.slice(0, 20)}...` : name}
              </div>
              
              ${includeAddBtn ? `<button>Add</button>` : ''}
            </div>`;
  }
  