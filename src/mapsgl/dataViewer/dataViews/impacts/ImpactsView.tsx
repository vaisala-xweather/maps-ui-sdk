import { get } from '@aerisweather/javascript-utils';
import { HStack, VStack } from '@/components/primitives/layout/Stack';
import { useDataContext } from '@/providers/DataProvider';
import { ImpactBar } from './ImpactBar';

interface Impact {
    id: string;
    name: string;
    index: number;
}

export const ImpactsView = () => {
    const { data } = useDataContext();
    const currentImpacts: Impact[] | undefined = get(data, '0.periods.0.impacts');

    return (
        currentImpacts && currentImpacts.length > 0 && (
            <VStack>
                <HStack className="xw-w-2/3 xw-ml-auto xw-justify-between">
                    <p className="xw-text-[11px] xw-font-semibold">Low</p>
                    <p className="xw-text-[11px] xw-font-semibold">Extreme</p>
                </HStack>
                {currentImpacts?.map((impact) => (
                    <HStack key={impact.id} className="xw-py-1">
                        <div className="xw-w-1/3">{impact.name}</div>
                        <div className="xw-w-2/3">
                            <ImpactBar level={impact.index}/>
                        </div>
                    </HStack>
                ))}
            </VStack>
        )
    );
};
