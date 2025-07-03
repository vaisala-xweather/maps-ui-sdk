import {
    type MapAdapterOptions,
    type WebGLLayer,
    type AnyMapController,
    type MapboxMap,
    type GoogleMap,
    type MaplibreMap,
    type L
} from '@aerisweather/mapsgl';
import Event from '@aerisweather/javascript-utils/dist/lib/es6/events/Event';
import { HANDLER_TO_EVENT_NAME } from '@/constants/mapController';

export enum MapEventName {
    Click = 'click',
    DoubleClick = 'dblclick',
    MouseDown = 'mousedown',
    MouseUp = 'mouseup',
    MouseOver = 'mouseover',
    MouseOut = 'mouseout',
    MouseMove = 'mousemove',
    Zoom = 'zoom',
    ZoomStart = 'zoom:start',
    ZoomEnd = 'zoom:end',
    Move = 'move',
    MoveStart = 'move:start',
    MoveEnd = 'move:end',
    Load = 'load',
    LoadStart = 'load:start',
    LoadComplete = 'load:complete',
    SourceAdd = 'source:add',
    LayerAdd = 'layer:add',
    LayerShow = 'layer:show',
    LayerHide = 'layer:hide',
    SourceRemove = 'source:remove',
    LayerRemove = 'layer:remove',
    Resize = 'resize',
    Unload = 'unload'
}

export enum MapEventHandlerName {
    onClick = 'onClick',
    onDoubleClick = 'onDoubleClick',
    onMouseDown = 'onMouseDown',
    onMouseUp = 'onMouseUp',
    onMouseOver = 'onMouseOver',
    onMouseOut = 'onMouseOut',
    onMouseMove = 'onMouseMove',
    onZoom = 'onZoom',
    onZoomStart = 'onZoomStart',
    onZoomEnd = 'onZoomEnd',
    onMove = 'onMove',
    onMoveStart = 'onMoveStart',
    onMoveEnd = 'onMoveEnd',
    onLoad = 'onLoad',
    onLoadStart = 'onLoadStart',
    onLoadComplete = 'onLoadComplete',
    onSourceAdd = 'onSourceAdd',
    onLayerAdd = 'onLayerAdd',
    onLayerShow = 'onLayerShow',
    onLayerHide = 'onLayerHide',
    onSourceRemove = 'onSourceRemove',
    onLayerRemove = 'onLayerRemove',
    onResize = 'onResize',
    onUnload = 'onUnload'
}

export type MapsGLEvent<T extends string = string> = Event & {
    readonly type: T;
    target: AnyMapController;
};

export type MapsGLCoordinateEvent = MapsGLEvent<
    MapEventName.Click |
    MapEventName.DoubleClick |
    MapEventName.MouseMove
> & {
    point: { x: number; y: number; };
    coord: { lat: number; lon: number; };
};

export type MapsGLLayerEvent = MapsGLEvent<
    MapEventName.LayerAdd |
    MapEventName.LayerRemove |
    MapEventName.LayerShow |
    MapEventName.LayerHide
> & {
    layer: WebGLLayer;
};

export type MapEventType = {
    [MapEventName.Click]: MapsGLCoordinateEvent;
    [MapEventName.DoubleClick]: MapsGLCoordinateEvent;
    [MapEventName.MouseMove]: MapsGLCoordinateEvent;
    [MapEventName.MouseDown]: MapsGLEvent<MapEventName.MouseDown>;
    [MapEventName.MouseUp]: MapsGLEvent<MapEventName.MouseUp>;
    [MapEventName.MouseOver]: MapsGLEvent<MapEventName.MouseOver>;
    [MapEventName.MouseOut]: MapsGLEvent<MapEventName.MouseOut>;
    [MapEventName.Zoom]: MapsGLEvent<MapEventName.Zoom>;
    [MapEventName.ZoomStart]: MapsGLEvent<MapEventName.ZoomStart>;
    [MapEventName.ZoomEnd]: MapsGLEvent<MapEventName.ZoomEnd>;
    [MapEventName.Move]: MapsGLEvent<MapEventName.Move>;
    [MapEventName.MoveStart]: MapsGLEvent<MapEventName.MoveStart>;
    [MapEventName.MoveEnd]: MapsGLEvent<MapEventName.MoveEnd>;
    [MapEventName.Load]: MapsGLEvent<MapEventName.Load>;
    [MapEventName.LoadStart]: MapsGLEvent<MapEventName.LoadStart>;
    [MapEventName.LoadComplete]: MapsGLEvent<MapEventName.LoadComplete>;
    [MapEventName.SourceAdd]: MapsGLEvent<MapEventName.SourceAdd>;
    [MapEventName.LayerAdd]: MapsGLLayerEvent;
    [MapEventName.LayerShow]: MapsGLLayerEvent;
    [MapEventName.LayerHide]: MapsGLLayerEvent;
    [MapEventName.SourceRemove]: MapsGLEvent<MapEventName.SourceRemove>;
    [MapEventName.LayerRemove]: MapsGLLayerEvent;
    [MapEventName.Resize]: MapsGLEvent<MapEventName.Resize>;
    [MapEventName.Unload]: MapsGLEvent<MapEventName.Unload>;
};

export type HandlerToEventName<T extends MapEventHandlerName> = typeof HANDLER_TO_EVENT_NAME[T];

export type MapEventHandlerProps = {
    [K in MapEventHandlerName]?: (event: MapEventType[HandlerToEventName<K>]) => void;
};

export type MapEventHandlers = {
    [K in MapEventName]?: (event: MapEventType[K]) => void;
};

export type MapEventConfig = {
    [K in MapEventName]: {
        eventName: K;
        handlerName: MapEventHandlerName;
    }
};

export type MapStrategyType = 'maplibre' | 'mapbox' | 'google' | 'leaflet';

export type Map = MaplibreMap | MapboxMap | GoogleMap | L.Map;

export type MapControllerOptions = Omit<MapAdapterOptions, 'account'>;

export interface MapControllerConfig {
    map: Map;
    strategy: MapStrategyType;
    accessKeys: {
        id: string;
        secret: string;
    };
    options?: MapControllerOptions;
}
