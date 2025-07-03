export interface Coordinates {
  lat: number;
  lon: number;
}

export type CoordinatesFormatter = (coordinates: Coordinates) => {
    lat: string | number;
    lon: string | number;
};

export interface FormattedCoordinates {
  lat: string | number;
  lon: string | number;
}

export interface UseLocationProps {
    /** Optional starting coordinates to initialize the location state */
    coordinates?: Coordinates;
    /** Optional structured coordinate formatting function */
    formatter?: CoordinatesFormatter;
    /** Callback invoked after coordinates change */
    onChange?: (coordinates: Coordinates) => void;
}
