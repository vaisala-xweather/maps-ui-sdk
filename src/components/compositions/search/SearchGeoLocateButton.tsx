import { forwardRef } from 'react';
import clsx from 'clsx';
import { IconButton } from '@/components/primitives/buttons/IconButton';
import { getCurrentLocation, formatCoordinates } from '@/utils/location';
import { fetchData } from '@/utils/fetchData';
import { useMapsGLMapControllerContext } from '@/mapsgl/MapsGLMapControllerProvider';
import { useLoadingContext } from '@/providers/LoadingProvider';
import { SearchResult } from '@/types/search';
import { WEATHER_API_ENDPOINT } from '@/constants/weatherApi/endpoint';
import { IconButtonWithDefaultsProps } from '@/types/button';
import { THEME } from '@/constants/theme';
import { GeoLocateIcon } from '@/components/compositions/icons/Icon';
import { useSearchContext } from './SearchProvider';

export type SearchGeolocateButtonProps = IconButtonWithDefaultsProps & {
    onGeoLocationError?: (error: GeolocationPositionError) => void;
};

export const SearchGeolocateButton = forwardRef<HTMLButtonElement, SearchGeolocateButtonProps>(({
    id = 'search-geolocate-button',
    icon = GeoLocateIcon,
    iconProps,
    onClick,
    className,
    onGeoLocationError,
    ...rest
}, ref) => {
    const { controller } = useMapsGLMapControllerContext();
    const { onSelectResult } = useSearchContext();
    const { setLoading } = useLoadingContext();

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);

        try {
            const { lat, lon } = await getCurrentLocation();
            const requestUrl = controller.account
                .api()
                .endpoint(WEATHER_API_ENDPOINT.places)
                .setParams({ p: formatCoordinates({ lat, lon }) } as any)
                .url();

            const data: { response: SearchResult } = await fetchData(requestUrl);

            if (data?.response) {
                onSelectResult(data?.response);
            }
        } catch (error) {
            console.error('Geolocation failed:', error);
            onGeoLocationError?.(error as GeolocationPositionError);
        } finally {
            setLoading(false, 0);
        }

        onClick?.(event);
    };

    const mergedIconProps = {
        size: 14,
        color: THEME.colors.white,
        ...iconProps
    };

    return (
        <IconButton
            ref={ref}
            id={id}
            icon={icon}
            iconProps={mergedIconProps}
            onClick={handleClick}
            className={clsx('xw-search-geolocate-button xw-shrink-0', className)}
            {...rest}
        />
    );
});

SearchGeolocateButton.displayName = 'Search.GeolocateButton';
