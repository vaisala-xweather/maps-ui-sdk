import { PanelList } from '@/components/primitives/layout/panel/PanelList';
import { HStack } from '@/components/primitives/layout/Stack';
import { getUnitText } from '@/utils/units';
import { useConditionsContext } from './ConditionsProvider';

const TABLE_DATA = [{ key: 'feelslike',
    label: 'Feels like' }, {
    key: 'windSpeed', label: 'Winds'
}, {
    key: 'dewpoint', label: 'Dew point'
}, {
    key: 'humidity', label: 'Humidity'
}, {
    key: 'pressure', label: 'Pressure'
}, {
    key: 'visibility', label: 'Visibility'
}, {
    key: 'sky', label: 'Sky cover'
}];

export interface ConditionsTableProps {
    className?: string;
}

export const ConditionsTable = ({ className }: ConditionsTableProps) => {
    const { conditions, units } = useConditionsContext();
    if (!conditions || !units) return null;

    return (
        <PanelList className={className} dividerClassName="xw-border-slate-200">
            {TABLE_DATA.map(({ key, label }) => (
                <HStack key={key} className="xw-py-1">
                    <div className="xw-w-1/2 xw-text-slate-600">
                        {label}
                    </div>
                    <div className="xw-w-1/2">
                        <p>
                            {key === 'windSpeed' ? `${conditions.windDir} ` : null}
                            {getUnitText(units, conditions, key)}
                        </p>
                    </div>
                </HStack>
            ))}
        </PanelList>
    );
};

ConditionsTable.displayName = 'Conditions.Table';
