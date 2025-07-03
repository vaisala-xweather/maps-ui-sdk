import {
    MapEventName,
    MapEventHandlerName
} from '@/types/mapController';
import { type MapEventConfig } from '@/types/mapController';

export const HANDLER_TO_EVENT_NAME: Record<MapEventHandlerName, MapEventName> = {
    [MapEventHandlerName.onClick]: MapEventName.Click,
    [MapEventHandlerName.onDoubleClick]: MapEventName.DoubleClick,
    [MapEventHandlerName.onMouseDown]: MapEventName.MouseDown,
    [MapEventHandlerName.onMouseUp]: MapEventName.MouseUp,
    [MapEventHandlerName.onMouseOver]: MapEventName.MouseOver,
    [MapEventHandlerName.onMouseOut]: MapEventName.MouseOut,
    [MapEventHandlerName.onMouseMove]: MapEventName.MouseMove,
    [MapEventHandlerName.onZoom]: MapEventName.Zoom,
    [MapEventHandlerName.onZoomStart]: MapEventName.ZoomStart,
    [MapEventHandlerName.onZoomEnd]: MapEventName.ZoomEnd,
    [MapEventHandlerName.onMove]: MapEventName.Move,
    [MapEventHandlerName.onMoveStart]: MapEventName.MoveStart,
    [MapEventHandlerName.onMoveEnd]: MapEventName.MoveEnd,
    [MapEventHandlerName.onLoad]: MapEventName.Load,
    [MapEventHandlerName.onLoadStart]: MapEventName.LoadStart,
    [MapEventHandlerName.onLoadComplete]: MapEventName.LoadComplete,
    [MapEventHandlerName.onSourceAdd]: MapEventName.SourceAdd,
    [MapEventHandlerName.onLayerAdd]: MapEventName.LayerAdd,
    [MapEventHandlerName.onLayerShow]: MapEventName.LayerShow,
    [MapEventHandlerName.onLayerHide]: MapEventName.LayerHide,
    [MapEventHandlerName.onSourceRemove]: MapEventName.SourceRemove,
    [MapEventHandlerName.onLayerRemove]: MapEventName.LayerRemove,
    [MapEventHandlerName.onResize]: MapEventName.Resize,
    [MapEventHandlerName.onUnload]: MapEventName.Unload
};

export const MAP_EVENT_CONFIG: MapEventConfig = {
    [MapEventName.Click]: {
        eventName: MapEventName.Click,
        handlerName: MapEventHandlerName.onClick
    },
    [MapEventName.DoubleClick]: {
        eventName: MapEventName.DoubleClick,
        handlerName: MapEventHandlerName.onDoubleClick
    },
    [MapEventName.MouseDown]: {
        eventName: MapEventName.MouseDown,
        handlerName: MapEventHandlerName.onMouseDown
    },
    [MapEventName.MouseUp]: {
        eventName: MapEventName.MouseUp,
        handlerName: MapEventHandlerName.onMouseUp
    },
    [MapEventName.MouseOver]: {
        eventName: MapEventName.MouseOver,
        handlerName: MapEventHandlerName.onMouseOver
    },
    [MapEventName.MouseOut]: {
        eventName: MapEventName.MouseOut,
        handlerName: MapEventHandlerName.onMouseOut
    },
    [MapEventName.MouseMove]: {
        eventName: MapEventName.MouseMove,
        handlerName: MapEventHandlerName.onMouseMove
    },
    [MapEventName.Zoom]: {
        eventName: MapEventName.Zoom,
        handlerName: MapEventHandlerName.onZoom
    },
    [MapEventName.ZoomStart]: {
        eventName: MapEventName.ZoomStart,
        handlerName: MapEventHandlerName.onZoomStart
    },
    [MapEventName.ZoomEnd]: {
        eventName: MapEventName.ZoomEnd,
        handlerName: MapEventHandlerName.onZoomEnd
    },
    [MapEventName.Move]: {
        eventName: MapEventName.Move,
        handlerName: MapEventHandlerName.onMove
    },
    [MapEventName.MoveStart]: {
        eventName: MapEventName.MoveStart,
        handlerName: MapEventHandlerName.onMoveStart
    },
    [MapEventName.MoveEnd]: {
        eventName: MapEventName.MoveEnd,
        handlerName: MapEventHandlerName.onMoveEnd
    },
    [MapEventName.Load]: {
        eventName: MapEventName.Load,
        handlerName: MapEventHandlerName.onLoad
    },
    [MapEventName.LoadStart]: {
        eventName: MapEventName.LoadStart,
        handlerName: MapEventHandlerName.onLoadStart
    },
    [MapEventName.LoadComplete]: {
        eventName: MapEventName.LoadComplete,
        handlerName: MapEventHandlerName.onLoadComplete
    },
    [MapEventName.SourceAdd]: {
        eventName: MapEventName.SourceAdd,
        handlerName: MapEventHandlerName.onSourceAdd
    },
    [MapEventName.LayerAdd]: {
        eventName: MapEventName.LayerAdd,
        handlerName: MapEventHandlerName.onLayerAdd
    },
    [MapEventName.LayerShow]: {
        eventName: MapEventName.LayerShow,
        handlerName: MapEventHandlerName.onLayerShow
    },
    [MapEventName.LayerHide]: {
        eventName: MapEventName.LayerHide,
        handlerName: MapEventHandlerName.onLayerHide
    },
    [MapEventName.SourceRemove]: {
        eventName: MapEventName.SourceRemove,
        handlerName: MapEventHandlerName.onSourceRemove
    },
    [MapEventName.LayerRemove]: {
        eventName: MapEventName.LayerRemove,
        handlerName: MapEventHandlerName.onLayerRemove
    },
    [MapEventName.Resize]: {
        eventName: MapEventName.Resize,
        handlerName: MapEventHandlerName.onResize
    },
    [MapEventName.Unload]: {
        eventName: MapEventName.Unload,
        handlerName: MapEventHandlerName.onUnload
    }
} as const;
