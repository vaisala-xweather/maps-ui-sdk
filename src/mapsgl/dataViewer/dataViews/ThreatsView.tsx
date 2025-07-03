import { get } from '@aerisweather/javascript-utils';
import { formatDirections } from '@/utils/direction';
import { useDataContext } from '@/providers/DataProvider';

export const ThreatsView = () => {
    const { data } = useDataContext();
    const threat = get(data, '0.periods.0.storms');

    return (
        threat && <p>{formatDirections(threat?.phrase?.long)}</p>
    );
};
