import { isEmpty } from '@aerisweather/javascript-utils';
import { VStack } from '@/components/primitives/layout/Stack';
import { useDataContext } from '@/providers/DataProvider';
import { useLocationContext } from '@/providers/LocationProvider';

export const PlacesView = () => {
    const { data } = useDataContext();
    const { coordinatesString } = useLocationContext();
    const { place } = data ?? {};

    const getLocationText = () => {
        const isNorthAmerica = place?.country === 'US' || place?.country === 'CA';
        return `${place?.name}${
            isEmpty(place?.state)
                ? ''
                : `, ${place?.state}`}${isNorthAmerica ? '' : `, ${place?.country}`}`;
    };

    return (
        (place || coordinatesString)
            ? <VStack>
                {place && <p className="xw-text-2xl xw-mb-0.5">{getLocationText()}</p>}
                {coordinatesString && <p className="xw-text-slate-600 xw-text-[11px]">{coordinatesString}</p>}
            </VStack>
            : null
    );
};
