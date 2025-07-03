import { get } from '@aerisweather/javascript-utils';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { useDataContext } from '@/providers/DataProvider';
import { UNITS } from '@/constants/units';

export interface OutlookViewProps {
    className?: string;
}

export const OutlookView = ({ className }: OutlookViewProps) => {
    const { data } = useDataContext();
    const { units } = useSettingsContext();
    const outlook = get(data, '0.phrases');

    return (<div>
        <p className={className}>{
            units.temperature === UNITS.temperature.degF
                ? outlook?.long
                : outlook?.longMET}
        </p>
    </div>);
};
