import { formatDate } from '@/utils/date';
import { getApiKey, getUnitText } from '@/utils/units';
import { HStack, VStack } from '@/components/primitives/layout/Stack';
import { Hr } from '@/components/primitives/layout/Hr';
import { useConditionsContext } from './ConditionsProvider';

export const ConditionsView = () => {
    const { conditions, units, date } = useConditionsContext();

    const temperatureKey = units ? getApiKey('temp', units) : null;
    if (!temperatureKey) return null;

    return (
        <>
            {date && (
                <p className="xw-text-[11px] xw-text-slate-600">
                    Last updated at {formatDate(date, 'HH:mm, MMM d, yyyy')}
                </p>
            )}

            <div className="xw-mt-3">
                <HStack className="xw-justify-between">
                    <VStack className="xw-py-2 xw-mb-2">
                        <p className="xw-text-3xl xw-mb-1">
                            {units ? getUnitText(units, conditions, 'temp') : null}
                        </p>
                        <p className="xw-text-base">
                            {conditions?.weatherPrimary}
                        </p>
                    </VStack>

                    <img
                        className="xw-w-20 xw-h-20"
                        src={`https://cdn.aerisapi.com/wxblox/icons/${
                            conditions?.icon || 'na.png'
                        }`}
                    />
                </HStack>

                <Hr className="xw-border-slate-700" />
            </div>
        </>
    );
};

ConditionsView.displayName = 'Conditions.View';
