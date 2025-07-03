import { HStack } from '@/components/primitives/layout/Stack';

// ColorRankBar

export const ImpactBar = ({ level }: {level: number}) => {
    const colors: any = {
        0: '#E4E8F1',
        1: '#04CF00',
        2: '#FFE500',
        3: '#FF8A00',
        4: '#EB0000',
        5: '#EB0000'
    };

    const { 0: base, ...levelColors } = colors;

    return (
        <HStack className="xw-border xw-border-slate-200 xw-justify-center
        xw-items-center xw-w-full xw-h-5 xw-p-1 xw-rounded-md xw-gap-0.5">
            {Object.keys(levelColors).map((color, index) => (
                <div
                    key={index}
                    className="xw-flex-grow xw-h-full xw-rounded-sm"
                    style={{ backgroundColor: index < level ? colors[level] : base }}
                />
            ))}
        </HStack>
    );
};
