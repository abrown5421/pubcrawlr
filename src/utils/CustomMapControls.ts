export class SearchHereButton {
    private _map?: maplibregl.Map;
    private _container?: HTMLDivElement;
    private _onClickHandler?: () => void;
  
    constructor(onClickHandler: () => void) {
      this._onClickHandler = onClickHandler;
    }
  
    onAdd(map: maplibregl.Map): HTMLDivElement {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
      this._container.innerHTML =
        '<button>' +
        '<span class="maplibregl-ctrl-icon search-img" aria-hidden="true" title="Search this area"></span>' +
        '</button>';
      this._container.addEventListener('contextmenu', (e) => e.preventDefault());
      this._container.addEventListener('click', () => this._onClickHandler && this._onClickHandler());
      return this._container;
    }
  
    onRemove(): void {
      if (this._container?.parentNode) {
        this._container.parentNode.removeChild(this._container);
      }
      this._map = undefined;
    }
  }
  