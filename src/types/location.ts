export interface Coordinates {
  lat: number;
  lon: number;
}

export type CoordinatesFormatter = (coordinates: Coordinates) => {
    lat: string | number;
    lon: string | number;
};

export type FormattedCoordinates = ReturnType<CoordinatesFormatter>;

export interface UseLocationProps {
    /** Optional starting coordinates to initialize the location state */
    coordinates?: Coordinates | null;
    /** Optional structured coordinate formatting function */
    formatter?: CoordinatesFormatter;
    /** Callback invoked after coordinates change */
    onChange?: (coordinates: Coordinates | null) => void;
}

export interface UseLocationReturn {
    /** Current coordinates, null when no selection */
    coordinates: Coordinates | null;
    /** Structured formatted coordinates, null if no coordinates or formatter */
    formattedCoordinates: FormattedCoordinates | null;
    /** Formatted coordinate string for display, null if no coordinates */
    coordinatesString: string | null;
    /** Coordinate setter allowing clearing selection with null */
    setCoordinates: (coordinates: Coordinates | null) => void;
}
