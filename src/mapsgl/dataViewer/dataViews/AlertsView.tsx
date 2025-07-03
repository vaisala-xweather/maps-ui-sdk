import { ReactNode } from 'react';
import { parseISO, format, isDate } from 'date-fns';
import { capitalizeWords } from '@/utils/text';
import { PanelList } from '@/components/primitives/layout/panel/PanelList';
import { useDataContext } from '@/providers/DataProvider';
import { HStack } from '@/components/primitives/layout/Stack';

interface Alert {
    details: {
        name: string;
        color: string;
    },
    timestamps: {
        beginsISO: string;
        expiresISO: string;
    }
}

interface AlertTextProps {
    name: string;
    beginsISO?: string;
    expiresISO?: string;
}

export const AlertText = ({
    name,
    beginsISO,
    expiresISO
}: AlertTextProps) => {
    const AlertTextBase = ({ children }: {children: ReactNode}) => (
        <p className="xw-pl-2 xw-py-0.5 xw-text-[13px]">
            {capitalizeWords(name)}
            <span className="xw-text-slate-500">
                {children}
            </span>
        </p>
    );
    const formatAlertText = (): ReactNode => {
        try {
            const startDate = typeof beginsISO === 'string' ? parseISO(beginsISO) : null;
            const endDate = typeof expiresISO === 'string' ? parseISO(expiresISO) : null;

            const startDateFormatted = isDate(startDate) && startDate ? format(startDate, 'EEE h:mm aaaa') : null;
            const endDateFormatted = isDate(endDate) && endDate ? format(endDate, 'EEE h:mm aaaa') : null;

            return ((startDateFormatted || endDateFormatted)
                ? <AlertTextBase>
                    {(startDateFormatted || endDateFormatted)
                    && `${startDateFormatted ? ` from ${startDateFormatted}` : ''}
                        ${endDateFormatted ? ` until ${endDateFormatted}` : ''} CDT`
                    }
                </AlertTextBase>
                : null);
        } catch (error) {
            console.error('Error formatting dates:', error);
            return <AlertTextBase> Invalid date format</AlertTextBase>;
        }
    };
    const alertText = !beginsISO && !expiresISO
        ? <AlertTextBase> No date information provided.</AlertTextBase>
        : formatAlertText();

    return alertText;
};

export default AlertText;

export const AlertsView = () => {
    const { data } = useDataContext();

    return (
        <PanelList dividerClassName="xw-border-slate-200">
            {data?.map((alert: Alert, index: number) => {
                const { name, color } = alert?.details ?? {};
                const { beginsISO, expiresISO } = alert?.timestamps ?? {};

                return (
                    <HStack key={index} className="xw-py-1.5 xw-items-start">
                        <div className="xw-w-9">
                            <HStack className="xw-border xw-border-slate-200 xw-justify-center
                            xw-items-center xw-w-9 xw-h-5 xw-rounded-md">
                                <div
                                    className="xw-w-7 xw-h-3 xw-rounded-sm"
                                    style={{ backgroundColor: `#${color}` }} />
                            </HStack>
                        </div>
                        <AlertText name={name} beginsISO={beginsISO} expiresISO={expiresISO} />

                    </HStack>);
            })}
        </PanelList>
    );
};
