import { ReactNode, useState, createContext, useContext, useRef } from 'react';
import { type AnyMapController } from '@xweather/mapsgl';
import { useMapController } from '@/mapsgl/useMapController';
import { useMapEventHandlers } from '@/mapsgl/useMapEventHandlers';
import {
    MapEventName,
    type MapEventHandlerProps,
    type MapEventHandlers,
    type MapControllerConfig,
    type Map,
    type MapEventType
} from '@/types/mapController';
import { getBreakpoint } from '@/utils/responsive';
import { buildMapEventHandlers } from '@/utils/mapController';
import { useLoadingContext } from '@/providers/LoadingProvider';

const DOUBLE_CLICK_DELAY = 300;

export interface MapsGLMapControllerContextValue {
    controller: AnyMapController;
    map: Map;
    isInitialized: boolean;
    isLegendVisible: boolean;
    isDataInspectorVisible: boolean;
    toggleLegend: () => void;
    toggleDataInspector: (event?: 'click' | 'move', stream?: boolean) => void;
}

export const MapsGLMapControllerContext = createContext<MapsGLMapControllerContextValue | null>(null);

export const useMapsGLMapControllerContext = () => {
    const context = useContext(MapsGLMapControllerContext);
    if (context === null) {
        throw new Error('useMapsGLMapControllerContext must be used within a MapsGLMapControllerProvider');
    }
    return context;
};

export interface MapsGLMapControllerProviderProps extends MapControllerConfig {
    children?: ReactNode;
    onClick?: (event: MapEventType[MapEventName.Click]) => void;
    onDoubleClick?: (event: MapEventType[MapEventName.DoubleClick]) => void;
    onMouseDown?: (event: MapEventType[MapEventName.MouseDown]) => void;
    onMouseUp?: (event: MapEventType[MapEventName.MouseUp]) => void;
    onMouseOver?: (event: MapEventType[MapEventName.MouseOver]) => void;
    onMouseOut?: (event: MapEventType[MapEventName.MouseOut]) => void;
    onMouseMove?: (event: MapEventType[MapEventName.MouseMove]) => void;
    onZoom?: (event: MapEventType[MapEventName.Zoom]) => void;
    onZoomStart?: (event: MapEventType[MapEventName.ZoomStart]) => void;
    onZoomEnd?: (event: MapEventType[MapEventName.ZoomEnd]) => void;
    onMove?: (event: MapEventType[MapEventName.Move]) => void;
    onMoveStart?: (event: MapEventType[MapEventName.MoveStart]) => void;
    onMoveEnd?: (event: MapEventType[MapEventName.MoveEnd]) => void;
    onLoad?: (event: MapEventType[MapEventName.Load]) => void;
    onLoadStart?: (event: MapEventType[MapEventName.LoadStart]) => void;
    onLoadComplete?: (event: MapEventType[MapEventName.LoadComplete]) => void;
    onSourceAdd?: (event: MapEventType[MapEventName.SourceAdd]) => void;
    onLayerAdd?: (event: MapEventType[MapEventName.LayerAdd]) => void;
    onLayerShow?: (event: MapEventType[MapEventName.LayerShow]) => void;
    onLayerHide?: (event: MapEventType[MapEventName.LayerHide]) => void;
    onSourceRemove?: (event: MapEventType[MapEventName.SourceRemove]) => void;
    onLayerRemove?: (event: MapEventType[MapEventName.LayerRemove]) => void;
    onResize?: (event: MapEventType[MapEventName.Resize]) => void;
    onUnload?: (event: MapEventType[MapEventName.Unload]) => void;
}

export function MapsGLMapControllerProvider({
    accessKeys,
    strategy,
    map,
    options,
    children,
    ...mapEventProps
}: MapsGLMapControllerProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLegendVisible, setIsLegendVisible] = useState(false);
    const [isDataInspectorVisible, setIsDataInspectorVisible] = useState(false);
    const dataInspectorRef = useRef<any>(null);
    const { setLoading } = useLoadingContext();
    const { onLoad, onLoadStart, onLoadComplete, onDoubleClick, onClick } = mapEventProps;
    const baseHandlers = buildMapEventHandlers(mapEventProps as Partial<MapEventHandlerProps>);
    const lastClickTime = useRef<number>(0);
    const clickTimeout = useRef<ReturnType<typeof setTimeout>>();
    const mapEventHandlers: Partial<MapEventHandlers> = {
        ...baseHandlers,
        [MapEventName.Load]: (event) => {
            setIsInitialized(true);

            if (strategy === 'mapbox' && map?.style?.loaded()) {
                onLoad?.(event);
            } else {
                onLoad?.(event);
            }
        },
        [MapEventName.LoadStart]: (event) => {
            setLoading(true);
            onLoadStart?.(event);
        },
        [MapEventName.LoadComplete]: (event) => {
            setLoading(false);
            onLoadComplete?.(event);
        },
        [MapEventName.Click]: (event) => {
            if (clickTimeout.current) {
                clearTimeout(clickTimeout.current);
            }

            const currentTime = Date.now();
            const lastClickTimeDelta = currentTime - lastClickTime.current;

            if (lastClickTimeDelta < DOUBLE_CLICK_DELAY) {
                lastClickTime.current = 0;
            } else {
                lastClickTime.current = currentTime;

                clickTimeout.current = setTimeout(() => {
                    onClick?.(event);
                }, DOUBLE_CLICK_DELAY);
            }
        },
        [MapEventName.DoubleClick]: (event) => {
            if (clickTimeout.current) {
                clearTimeout(clickTimeout.current);
            }
            onDoubleClick?.(event);
        }
    };

    const controller = useMapController({
        map,
        strategy,
        accessKeys,
        options
    });

    useMapEventHandlers(controller, mapEventHandlers);

    const toggleLegend = () => {
        if (!controller) return;

        if (isLegendVisible) {
            controller.removeLegendControl();
            setIsLegendVisible(false);
        } else {
            const breakpoint = getBreakpoint(window.innerWidth);
            controller.addLegendControl(controller.container, {
                width: breakpoint === 'base' ? 240 : 340
            });
            setIsLegendVisible(true);
        }
    };

    const toggleDataInspector = (event: 'click' | 'move' = 'click', stream = true) => {
        if (!controller) return;

        if (!dataInspectorRef.current) {
            dataInspectorRef.current = controller.addDataInspectorControl({ event, stream });
        }

        if (isDataInspectorVisible) {
            dataInspectorRef.current.disable();
            setIsDataInspectorVisible(false);
        } else {
            dataInspectorRef.current.enable();
            setIsDataInspectorVisible(true);
        }
    };
    if (!isInitialized || !controller) return <div></div>;

    return (
        <MapsGLMapControllerContext.Provider
            value={{
                controller,
                map: controller.map,
                isInitialized,
                isLegendVisible,
                isDataInspectorVisible,
                toggleLegend,
                toggleDataInspector
            }}
        >
            {children}
        </MapsGLMapControllerContext.Provider>
    );
}
