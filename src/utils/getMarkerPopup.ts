import { MarkerPopupProps } from "../types/globalTypes";

export function getMarkerPopup({
    name,
    vicinity,
    includeAddBtn,
    includeRemBtn
}: MarkerPopupProps): string {
    return `<div style="display: flex; flex-direction: column; align-items: left;">
              
              <div style="font-weight: bold; font-size: 16px; margin: 8px;">
                ${name.length > 38 ? `${name.slice(0, 20)}...` : name}
              </div>
              <div style="font-size: 14px;">
                ${typeof vicinity === 'string' ? vicinity.length > 40 ? `${vicinity.slice(0, 37)}...` : vicinity : ''}
              </div>
              ${includeAddBtn ? `
                <button 
                  style="
                    margin-top: 8px;
                    background-color: #00171f;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    padding: 6px 16px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.3s, color 0.3s;"
                  onmouseover="this.style.backgroundColor='#ffffff'; this.style.color='#00171f';"
                  onmouseout="this.style.backgroundColor='#00171f'; this.style.color='#ffffff';"
                >
                  Add
                </button>` : ''}

              ${includeRemBtn ? `
                <button 
                  style="
                    margin-top: 8px;
                    background-color: #cc0000;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    padding: 6px 16px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.3s;"
                  onmouseover="this.style.backgroundColor='#990000';"
                  onmouseout="this.style.backgroundColor='#cc0000';"
                >
                  Remove
                </button>` : ''}
            </div>`;
  }
  