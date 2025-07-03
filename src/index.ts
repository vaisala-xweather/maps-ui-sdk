/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// MapsGL
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

export { MapsGLTimelineControl } from './mapsgl/MapsGLTimelineControl';
export { MapsGLLayerSettingsView } from './mapsgl/MapsGLLayerSettingsView';
export { MapsGLSearchControl } from './mapsgl/MapsGLSearchControl';
export type { MapsGLSearchControlProps } from './mapsgl/MapsGLSearchControl';
export {
    MapsGLMapControllerProvider,
    MapsGLMapControllerContext,
    useMapsGLMapControllerContext,
    type MapsGLMapControllerProviderProps
} from './mapsgl/MapsGLMapControllerProvider';
export {
    MapsGLLayersContext,
    MapsGLLayersProvider,
    useMapsGLLayersContext,
    type MapsGLLayersProviderProps,
    type MapsGLLayersContextProps
} from './mapsgl/MapsGLLayersProvider';

export { useWeatherApi } from './mapsgl/useWeatherApi';
export { useMapController } from './mapsgl/useMapController';
export { useMapEventHandlers } from './mapsgl/useMapEventHandlers';

// prebuilt data viewer views
export { ForecastView } from './mapsgl/dataViewer/dataViews/forecast/ForecastView';
export { ForecastDailyView } from './mapsgl/dataViewer/dataViews/forecast/ForecastDailyView';
export { ForecastHourlyView } from './mapsgl/dataViewer/dataViews/forecast/ForecastHourlyView';
export { AlertsView } from './mapsgl/dataViewer/dataViews/AlertsView';
export { PlacesView } from './mapsgl/dataViewer/dataViews/PlacesView';
export { ThreatsView } from './mapsgl/dataViewer/dataViews/ThreatsView';
export { ImpactsView } from './mapsgl/dataViewer/dataViews/impacts/ImpactsView';
export { OutlookView } from './mapsgl/dataViewer/dataViews/OutlookView';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { Conditions, type ConditionsProps } from './mapsgl/dataViewer/dataViews/conditions';

// Context
export { ConditionsContext, useConditionsContext } from './mapsgl/dataViewer/dataViews/conditions/ConditionsProvider';

// Sub-components
export { ConditionsRoot, type ConditionsRootProps } from './mapsgl/dataViewer/dataViews/conditions';
export {
    ConditionsProvider,
    type ConditionsProviderProps
} from './mapsgl/dataViewer/dataViews/conditions/ConditionsProvider';
export { ConditionsView } from './mapsgl/dataViewer/dataViews/conditions/ConditionsView';
export { ConditionsTable, type ConditionsTableProps } from './mapsgl/dataViewer/dataViews/conditions/ConditionsTable';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

// prebuilt data viewer cards
export { ForecastCard } from './mapsgl/dataViewer/dataCards/ForecastCard';
export { ForecastDailyCard } from './mapsgl/dataViewer/dataCards/ForecastDailyCard';
export { ForecastHourlyCard } from './mapsgl/dataViewer/dataCards/ForecastHourlyCard';
export { AlertsCard } from './mapsgl/dataViewer/dataCards/AlertsCard';
export { ThreatsCard } from './mapsgl/dataViewer/dataCards/ThreatsCard';
export { ImpactsCard } from './mapsgl/dataViewer/dataCards/ImpactsCard';
export { ConditionsCard } from './mapsgl/dataViewer/dataCards/ConditionsCard';

// forecast
export { ForecastBaseTable } from './mapsgl/dataViewer/dataViews/forecast/ForecastBaseTable';
export { ForecastBaseView } from './mapsgl/dataViewer/dataViews/forecast/ForecastBaseView';
export { ForecastDailyTable } from './mapsgl/dataViewer/dataViews/forecast/ForecastDailyTable';
export { ForecastHourlyTable } from './mapsgl/dataViewer/dataViews/forecast/ForecastHourlyTable';

// custom layer styles
export { customFiresStyle, customEarthquakesStyle, customLightningStyle } from './mapsgl/customLayerStyles';

/* ------------------------------------------------------------------------------------------------------------------ */
// Compound Component
export { MapsGLLayersControl, type MapsGLLayersControlProps } from './mapsgl/MapsGLLayersControl';

// Sub-components
export {
    ButtonBase, type ButtonBaseProps,
    ListButtonSettingsView, type ListButtonSettingsViewProps,
    ListButton, type ListButtonProps,
    ListButtonBase, type ListButtonBaseProps,
    ListButtonOption, type ListButtonOptionProps,
    ListButtonOptionsContainer, type ListButtonOptionsContainerProps,
    ListButtonGroup, type ListButtonGroupProps,
    ListItem, type ListItemProps,
    ListGroup, type ListGroupProps,
    ListControl, type ListControlProps,
    Divider, type DividerProps
} from './mapsgl/MapsGLLayersControl';

// Hooks
export {
    useLayerControl,
    useLayerGroupControl
} from './mapsgl/MapsGLLayersControl';
/* ------------------------------------------------------------------------------------------------------------------ */

// constants
export { LAYER_CONTROL_DATA } from './mapsgl/layerControl';
export {
    LayerSchema,
    PaintStyleKeys,
    SampleStyleKeys,
    ParticleStyleKeys,
    GridStyleKeys,
    SymbolStyleKeys,
    DataStyleKeys
} from './mapsgl/layerDataSchema';

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Components
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Primitives

// Controls
export { Select, type SelectProps } from './components/primitives/controls/Select';
export { DataSlider, type DataSliderProps } from './components/primitives/controls/DataSlider';
export { ToggleGroup, type ToggleGroupProps } from './components/primitives/controls/ToggleGroup';
export { RadioGroup, type RadioGroupProps } from './components/primitives/controls/RadioGroup';
export { Toggle, type ToggleProps } from './components/primitives/controls/Toggle';

// animations
export { ExpandCollapseVertical } from './components/primitives/animation/ExpandCollapseVertical';
export { ExpandCollapseHorizontal } from './components/primitives/animation/ExpandCollapseHorizontal';
export { Fade, FadePresence } from './components/primitives/animation/Fade';
export { LoadingBar } from './components/primitives/animation/LoadingBar';
export { LoadingSpinner } from './components/primitives/animation/LoadingSpinner';
export { Slide } from './components/primitives/animation/Slide';

// layout
export { Anchor } from './components/primitives/layout/anchor';
export { Grid } from './components/primitives/layout/Grid';
export { Hr } from './components/primitives/layout/Hr';
export { Stack, HStack, VStack, type StackProps } from './components/primitives/layout/Stack';
export { ScrollableArea } from './components/primitives/layout/ScrollableArea';
export { Positioner } from './components/primitives/layout/Positioner';

// display
export { DateDisplay } from './components/primitives/display/dateDisplay';
export { DateBase } from './components/primitives/display/dateDisplay/DateBase';
export { DateNumber } from './components/primitives/display/dateDisplay/DateNumber';
export { DayShort } from './components/primitives/display/dateDisplay/DayShort';
export { Time } from './components/primitives/display/dateDisplay/Time';

export { Icon, type IconProps } from './components/primitives/display/Icon';
export { Circle } from './components/primitives/display/Circle';

// overlays

/* ------------------------------------------------------------------------------------------------------------------ */
// Compound Component
export { Modal, type ModalProps } from './components/primitives/overlays/modal';

// Context
export {
    ModalContext, type ModalContextType,
    ModalDataDefault, type ModalData,
    useModalContext
} from './components/primitives/overlays/modal';

// Sub-components
export {
    ModalRoot, type ModalRootProps,
    ModalProvider, type ModalProviderProps,
    ModalHeader, type ModalHeaderProps,
    ModalBody, type ModalBodyProps,
    ModalFooter, type ModalFooterProps,
    ModalCloseButton, type ModalCloseButtonProps,
    ModalTitle, type ModalTitleProps,
    ModalDescription, type ModalDescriptionProps
} from './components/primitives/overlays/modal';
/* ------------------------------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------------------------------------------------ */
// Popover
export { Popover, type PopoverProps } from './components/primitives/overlays/popover';

// Sub-components
export {
    PopoverRoot, type PopoverRootProps,
    PopoverTrigger, type PopoverTriggerProps,
    PopoverContent, type PopoverContentProps,
    PopoverPosition, type PopoverPositionProps,
    PopoverArrow, type PopoverArrowProps,
    PopoverClose, type PopoverCloseProps,
    PopoverTitle, type PopoverTitleProps
} from './components/primitives/overlays/popover';
/* ------------------------------------------------------------------------------------------------------------------ */

// text
export { Heading, type HeadingProps } from './components/primitives/text/Heading';

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compositions

// buttons
export { CloseButton } from './components/compositions/buttons/CloseButton';
export { ThumbnailButton } from './components/compositions/buttons/ThumbnailButton';
export { UnitButton } from './components/compositions/buttons/UnitButton';

/* ------------------------------------------------------------------------------------------------------------------ */
// ColorRange
export { ColorRange, type ColorRangeProps } from './components/compositions/colorRange';

// Context
export { ColorRangeProvider, type ColorRangeProviderProps } from './components/compositions/colorRange';

// Sub-components
export {
    ColorRangeRoot, type ColorRangeRootProps,
    ColorRangeOffset, type ColorRangeOffsetProps,
    ColorRangeBar, type ColorRangeBarProps,
    ColorRangeGradient, type ColorRangeGradientProps,
    ColorRangeCircle, type ColorRangeCircleProps,
    ColorRangeLabel, type ColorRangeLabelProps
} from './components/compositions/colorRange';
/* ------------------------------------------------------------------------------------------------------------------ */

// control
export { Control } from './components/compositions/control';

/* ------------------------------------------------------------------------------------------------------------------ */
// Compound Component
export { DataViewer, type DataViewerProps } from './components/compositions/dataViewer';

// Sub-components
export {
    DataViewerRoot, type DataViewerRootProps,
    DataViewerHeader, type DataViewerHeaderProps,
    DataViewerBanner, type DataViewerBannerProps,
    DataViewerBody, type DataViewerBodyProps,
    DataViewerCard, type DataViewerCardProps,
    DataViewerCardBody, type DataViewerCardBodyProps,
    DataViewerCardTitle, type DataViewerCardTitleProps,
    DataViewerCardDivider, type DataViewerCardDividerProps,
    DataViewerDataWrapper, type DataViewerDataWrapperProps,
    DataViewerCloseButton, type DataViewerCloseButtonProps,
    DataViewerLoadingFallback, type DataViewerLoadingFallbackProps,
    DataViewerTitle, type DataViewerTitleProps
} from './components/compositions/dataViewer';
/* ------------------------------------------------------------------------------------------------------------------ */

// drawer
export { Drawer } from './components/compositions/drawer/Drawer';

/* ------------------------------------------------------------------------------------------------------------------ */
// Compound Component
export { Field, type FieldProps, type FieldComponent } from './components/compositions/field';

// Context
export { FieldContext, useFieldContext, type FieldContextValue } from './components/compositions/field';

// Sub-components
export {
    FieldRoot, type FieldRootProps,
    FieldProvider, type FieldProviderProps,
    FieldLabel, type FieldLabelProps,
    FieldControl, type FieldControlProps
} from './components/compositions/field';
/* ------------------------------------------------------------------------------------------------------------------ */

// icons
export * from './components/compositions/icons/Icon';

/* ------------------------------------------------------------------------------------------------------------------ */
// Search
export { Search, type SearchProps } from './components/compositions/search';

// Context
export {
    SearchContext, useSearchContext,
    SearchClearContext, useSearchClearContext,
    SearchItemContext, useSearchItemContext,
    type SearchContextProps,
    type SearchClearContextValue,
    type SearchItemContextValue
} from './components/compositions/search';

// Sub-components
export {
    SearchRoot, type SearchRootProps,
    SearchProvider, type SearchProviderProps,
    SearchFocusArea, type SearchFocusAreaProps,
    SearchResultsFetcher, type SearchResultsFetcherProps,
    SearchResultsData, type SearchResultsDataProps,
    SearchList, type SearchListProps,
    SearchScrollableArea, type SearchScrollableAreaProps,
    SearchGroup, type SearchGroupProps,
    SearchGroupTitle, type SearchGroupTitleProps,
    SearchDivider, type SearchDividerProps,
    SearchItem, type SearchItemProps,
    SearchItemButton, type SearchItemButtonProps,
    SearchBar, type SearchBarProps,
    SearchInput, type SearchInputProps,
    SearchLoadingSpinner, type SearchLoadingSpinnerProps,
    SearchIcon, type SearchIconProps,
    SearchGeolocateButton, type SearchGeolocateButtonProps,
    SearchClear, type SearchClearProps
} from './components/compositions/search';

// Types
export type * from './types/search';
/* ------------------------------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------------------------------------------------ */
// Timeline
export { Timeline, type TimelineProps } from './components/compositions/timeline';

// Context
export {
    TimelineContext, type TimelineContextProps,
    useTimelineContext
} from './components/compositions/timeline';

// Sub-components
export {
    TimelineRoot, type TimelineRootProps,
    TimelineProvider, type TimelineProviderProps,
    TimelineContainer, type TimelineContainerProps,
    TimelineAnimationControl, type TimelineAnimationControlProps,
    TimelineSettingsControl, type TimelineSettingsControlProps,
    TimelineTrackContainer, type TimelineTrackContainerProps,
    TimelineTrack, type TimelineTrackProps,
    TimelineTicks, type TimelineTicksProps,
    TimelineTick, type TimelineTickProps,
    TimelineTickDateText, type TimelineTickDateTextProps,
    TimelineTimeText, type TimelineTimeTextProps,
    TimelineDateText, type TimelineDateTextProps,
    TimelineScrubber, type TimelineScrubberProps,
    TimelineCenteredIndicator, type TimelineCenteredIndicatorProps,
    TimelineTimeProgressIndicator, type TimelineTimeProgressIndicatorProps,
    TimelineLineProgressIndicator,
    TimelineResizeHandler, type TimelineResizeHandlerProps,
    TimelineMoveToStart, type TimelineMoveToStartProps,
    TimelineMoveToEnd, type TimelineMoveToEndProps,
    TimelineMoveToNow, type TimelineMoveToNowProps
} from './components/compositions/timeline';

// Hooks
export { useTicks, type UseTicksProps } from './components/compositions/timeline';

// Types
export type * from './types/timeline';
/* ------------------------------------------------------------------------------------------------------------------ */

// data
export { WeatherApiDataFetcher } from './components/data/api/WeatherApiDataFetcher';
export { SuspenseWrapper } from './components/data/api/SuspenseWrapper';
export { DataFetcher } from './components/data/DataFetcher';

/* ------------------------------------------------------------------------------------------------------------------ */

// buttons
export { Button } from './components/primitives/buttons/Button';
export { IconButton } from './components/primitives/buttons/IconButton';

// panel
export { Panel } from './components/primitives/layout/panel';
export { PanelHeader } from './components/primitives/layout/panel/PanelHeader';
export { PanelBody } from './components/primitives/layout/panel/PanelBody';
export { PanelList } from './components/primitives/layout/panel/PanelList';
export { PanelGroup } from './components/primitives/layout/panel/PanelGroup';
export { PanelItem } from './components/primitives/layout/panel/PanelItem';

/* ------------------------------------------------------------------------------------------------------------------ */
// Tabs
export { Tabs, type TabsProps } from './components/primitives/navigation/tabs';

// Context
export { TabsContext, useTabsContext } from './components/primitives/navigation/tabs';
export type { TabsContextProps } from './components/primitives/navigation/tabs';

// Sub-components
export {
    TabsRoot, type TabsRootProps,
    TabsProvider, type TabsProviderProps,
    TabsPosition, type TabsPositionProps,
    TabsContent, type TabsContentProps,
    TabsList, type TabsListProps,
    TabsButton, type TabsButtonProps,
    TabsAnimation, type TabsAnimationProps,
    TabsAnimatedContent, type TabsAnimatedContentProps,
    TabsAnimationProvider, type TabsAnimationProviderProps
} from './components/primitives/navigation/tabs';
/* ------------------------------------------------------------------------------------------------------------------ */

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Hooks
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
export { useWindowResizeListener } from './hooks/useWindowResizeListener';
export { useFetch } from './hooks/useFetch';
export { useResponsive } from './hooks/useResponsive';
export { useTimeInterval } from './hooks/useTimeInterval';
export { usePosition } from './hooks/usePosition';
export { useResponsivePosition } from './hooks/useResponsivePosition';
export { useUnitDisplay } from './hooks/useUnitDisplay';
export { useLocation } from './hooks/useLocation';

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Providers
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

export { DrawerProvider, DrawerContext, useDrawerContext } from './providers/DrawerProvider';
export { DataProvider, DataContext, useDataContext } from './providers/DataProvider';
export { DateProvider, DateContext, useDateContext } from './providers/DateProvider';
export { LoadingProvider, LoadingContext, useLoadingContext } from './providers/LoadingProvider';
export { PositionProvider, PositionContext, usePositionContext } from './providers/PositionProvider';
export { VisibilityProvider, VisibilityContext, useVisibilityContext } from './providers/VisibilityProvider';
export {
    SettingsProvider,
    SettingsContext,
    useSettingsContext
} from './providers/SettingsProvider';
export { ExpandCollapseProvider, ExpandCollapseContext } from './providers/ExpandCollapseProvider';
export { LocationProvider, LocationContext, useLocationContext } from './providers/LocationProvider';

// reducers
export { expandCollapseStateReducer } from './reducers/expandCollapseStateReducer';
export { layerStateReducer } from './reducers/layerStateReducer';
export { stateReducer } from './reducers/stateReducer';
export { settingsStateReducer } from './reducers/settingsStateReducer';

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Utils
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

export { convert, formatUnitText, getMapsGLUnitSymbol } from './utils/units';
export {
    resolveUnitToKey,
    resolveUnitToSymbol,
    resolveUnitToConfig,
    resolveUnitToSymbolByMeasurement
} from './utils/unitRegistry';
export {
    isUnitSystem,
    isMeasurementType,
    isValidUnitsObject,
    isDefaultUnits,
    isValidUnitForMeasurementType
} from './utils/unitTypeGuards';
export { capitalizeWords } from './utils/text';
export { fetchData } from './utils/fetchData';
export { getCurrentLocation } from './utils/location';
export { layerStateFromConfig, getControlSettings } from './utils/layers';
export { normalizeOptions, normalizeControlSettings } from './utils/control';
export { getBreakpoint, resolveResponsiveProperty } from './utils/responsive';
export { isCoordinate, isZipCode, isAirportCode, isPopulatedArea, formatCoordinates } from './utils/location';
export { getMapController, buildMapEventHandlers } from './utils/mapController';

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Constants
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

export { EVENT, LAYER } from './constants/action';
export { CONTROL_TYPE } from './constants/control';
export { POSITION, SIDE, ALIGN } from './constants/position';
export { Font } from './constants/tailwindClasses';
export { TIME_INTERVALS } from './constants/timeIntervals';
export {
    UNIT_SYMBOLS,
    UNITS,
    DEFAULT_UNITS,
    UNIT_SYSTEM,
    MEASUREMENT_TYPE,
    MEASUREMENT_TYPES,
    UNIT_REGISTRY,
    UNIT_ALIAS_LOOKUP,
    UNIT_ALIASES,
    MEASUREMENT_TYPE_API_MAPPINGS
} from './constants/units';
export { MAPSGL_VALUE_CONVERTERS } from './constants/valueConverterMapping';
export { GENERAL, MONOCHROME } from './constants/weatherLayerThemes';
export { WEATHER_API_ACTION } from './constants/weatherApi/action';
export { WEATHER_API_CONFIG } from './constants/weatherApi/config';
export { NORMALIZED_COLOR_SCALES } from './constants/colors';
export { EXPAND_COLLAPSE_ANIMATION_STATES } from './constants/animation';
export { THEME } from './constants/theme';
export { BREAKPOINTS } from './constants/responsive';
export { MAP_EVENT_CONFIG } from './constants/mapController';

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Types
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
export type * from './types/buttonList';
export type * from './types/layer';
export type * from './types/control';
export type * from './types/animation';
export type * from './types/units';
export type * from './types/mapController';
export type * from './types/settings';
