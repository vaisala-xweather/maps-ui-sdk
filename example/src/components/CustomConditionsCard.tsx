import { useState } from 'react';
import clsx from 'clsx';
import { ConditionsCard, Conditions, IconButton, ExpandCollapseVertical, HStack } from '@xweather/maps-ui-sdk';
import { ChevronDownIcon } from './Icons';

export const CustomConditionsCard = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <ConditionsCard className="transition-all mb-2 bg-white p-4">
            <Conditions.Provider>
                <Conditions.View />
                <HStack className={clsx(
                    'w-[90px] items-center mt-1'
                )}>
                    <IconButton
                        className="w-full text-left"
                        icon={ChevronDownIcon}
                        iconProps={{
                            className: clsx(
                                'ml-auto transition-transform origin-center',
                                expanded && 'rotate-180'
                            ),
                            size: 12
                        }}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <span className="text-slate-700 text-left w-full mr-2 font-semibold">
                            {expanded ? 'Hide' : 'Full'} Details</span>
                    </IconButton>
                </HStack>
                <ExpandCollapseVertical className="pt-2" expanded={expanded}>
                    <Conditions.Table />
                </ExpandCollapseVertical>
            </Conditions.Provider>
        </ConditionsCard>
    );
};
