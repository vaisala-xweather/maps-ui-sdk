declare module 'geo-coordinates-parser' {
    export interface GeoCoordinatesResult {
        decimalLatitude: number;
        decimalLongitude: number;
    }
    export function convert(input: string): GeoCoordinatesResult;
}
