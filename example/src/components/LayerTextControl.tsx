import { useLayerControl, RadioGroup, Grid } from '@xweather/maps-ui-sdk';

interface LayerTextControlProps {
    id: string;
    parentId: string;
    value: boolean;
    title: string;
    className?: string;
    onValueChange?: (value: any) => void;
}

export const LayerTextControl = ({
    id,
    value,
    onValueChange,
    className,
    ...rest
}: LayerTextControlProps) => {
    const { toggleLayer } = useLayerControl({ id, ...rest });
    const options = [{ label: 'On', value: 'on' }, { label: 'Off', value: 'off' }];

    const handleChange = (newValue: string | number) => {
        toggleLayer(id);
        onValueChange?.(newValue === 'on');
    };

    return (
        <RadioGroup
            id={id}
            name={id}
            value={value ? 'on' : 'off'}
            onValueChange={handleChange}
            className={className}
        >
            <Grid itemsPerRow={2}>
                {options.map((option) => (
                    <RadioGroup.Item
                        key={option.label}
                        value={option.value}
                    >
                        {option.label}
                    </RadioGroup.Item>
                ))}
            </Grid>
        </RadioGroup>
    );
};
