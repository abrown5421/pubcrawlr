import { MarkerPopupProps } from "../types/globalTypes";

export function getMarkerPopup({
    imageUrl,
    name,
    rating,
    includeAddBtn
}: MarkerPopupProps): string {
    return `<div style="display: flex; flex-direction: column; align-items: left;">
              ${imageUrl ? `<img src="${imageUrl}" alt="${name}" style="width: 200px; padding: 0px; height: 150px; object-fit: cover;" />` : ''}
              <div style="font-weight: bold; font-size: 16px; margin: 8px;">
                ${name.length > 38 ? `${name.slice(0, 20)}...` : name}
              </div>
              <div style="font-size: 14px; margin-left: 8px;">Rating: ${rating ?? "N/A"}</div>
              ${includeAddBtn ? `<button>Add</button>` : ''}
            </div>`;
  }
  