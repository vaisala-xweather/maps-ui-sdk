import {
    MeasurementType,
    Unit,
    UNITS,
    MEASUREMENT_TYPE,
    UNIT_SYSTEM,
    useSettingsContext,
    useMapsGLMapControllerContext,
    Panel,
    Button,
    HStack,
    VStack,
    Grid,
    Field,
    RadioGroup
} from '@xweather/maps-ui-sdk';
import { DARK_SMALL, LIGHT_SMALL, STREETS_SMALL } from '../constants/mapStyleImages';

export type BaseMapTitle = 'Streets' | 'Light' | 'Dark';
export type BaseMapValue = 'streets' | 'light' | 'dark';

interface BaseMap {
    title: BaseMapTitle
    value: BaseMapValue,
    imageSource: string
}

interface BaseMapButtonsProps {
    baseMap: BaseMap
    selected: boolean
    onUpdate: (name: string, value: BaseMapValue) => void
}

interface MapStyleKeys {
    mapbox: Record<string, string>
}

interface UnitConfig {
    type: MeasurementType;
    label: string;
    units: Unit[];
}

const BaseMapButtons = ({ onUpdate, baseMap, selected }: BaseMapButtonsProps) => (
    <HStack
        className={`${selected ? 'opacity-100' : 'opacity-70'}`}
    >
        <Button
            id={`base-map-button__${baseMap.value}`}
            className="flex items-center text-xs"
            onClick={() => onUpdate('baseMap', baseMap.value)}
        >
            <img
                className="size-9 rounded mr-3 border border-slate-700"
                src={baseMap.imageSource}/>
            {baseMap.title}
        </Button>
    </HStack>
);

const MAP_STYLE_KEYS: MapStyleKeys = {
    mapbox: {
        light: 'light-v9',
        dark: 'dark-v9',
        streets: 'streets-v11'
    }
};

const {
    temperature,
    speed,
    pressure,
    distance,
    rate,
    precipitation,
    snowfall,
    height
} = UNITS;

export const UNIT_SETTINGS: UnitConfig[] = [{
    type: MEASUREMENT_TYPE.temperature,
    label: 'Temperature',
    units: [temperature.degC, temperature.degF]
}, {
    type: MEASUREMENT_TYPE.speed,
    label: 'Speed',
    units: [speed.kph, speed.kts, speed.mph, speed.mps]
}, {
    type: MEASUREMENT_TYPE.pressure,
    label: 'Pressure',
    units: [pressure.hpa, pressure.mb, pressure.inhg]
}, {
    type: MEASUREMENT_TYPE.distance,
    label: 'Distance',
    units: [distance.km, distance.mi]
}, {
    type: MEASUREMENT_TYPE.height,
    label: 'Height',
    units: [height.m, height.ft]
}, {
    type: MEASUREMENT_TYPE.rate,
    label: 'Precip Rate / Radar',
    units: [rate.mmh, rate.inh, rate.dbz]
}, {
    type: MEASUREMENT_TYPE.precipitation,
    label: 'Rain',
    units: [precipitation.mm, precipitation.in]
}, {
    type: MEASUREMENT_TYPE.snowfall,
    label: 'Snow',
    units: [snowfall.cm, snowfall.in]
}];

const UNIT_SYSTEM_SETTINGS = [{
    value: 'custom',
    label: 'Custom'
}, {
    value: UNIT_SYSTEM.metric,
    label: 'Metric'
}, {
    value: UNIT_SYSTEM.imperial,
    label: 'Imperial'
}] as const;

const BASE_MAP_BUTTONS_CONFIG: BaseMap[] = [{
    title: 'Streets', value: 'streets', imageSource: STREETS_SMALL
}, { title: 'Light', value: 'light', imageSource: LIGHT_SMALL },
{ title: 'Dark', value: 'dark', imageSource: DARK_SMALL }];

export const SettingsControl = () => {
    const { updateSetting, ...settings } = useSettingsContext();
    const { controller } = useMapsGLMapControllerContext();

    const handleUpdate = (name: string, value: string) => {
        if (controller && name === 'baseMap' && value !== undefined) {
            controller.map.setStyle(`mapbox://styles/mapbox/${MAP_STYLE_KEYS.mapbox[value]}`);
        }
        updateSetting(name, value);
    };

    return (
        <Panel className="px-4">
            <Panel.Group
                title="Base Map"
                titleClassName="mb-2 text-xl"
                containerClassName="mb-3 pt-3"
            >
                <VStack className="gap-1.5">
                    {BASE_MAP_BUTTONS_CONFIG.map((map, index) => (
                        <BaseMapButtons
                            key={index}
                            baseMap={map}
                            onUpdate={handleUpdate}
                            selected={settings?.baseMap === map.value}
                        />
                    ))}
                </VStack>
            </Panel.Group>

            <Panel.Group
                title="Units"
                titleClassName="mb-2 text-xl"
                containerClassName="pt-3">
                <Field
                    orientation="vertical"
                    className="mb-3"
                >
                    <Field.Label>Unit System</Field.Label>
                    <Field.Control asChild>
                        <RadioGroup
                            value={settings.unitSystem}
                            onValueChange={(value) => handleUpdate('unitSystem', value)}
                        >
                            <Grid>
                                {UNIT_SYSTEM_SETTINGS.map((option) => (
                                    <RadioGroup.Item
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </RadioGroup.Item>
                                ))}
                            </Grid>
                        </RadioGroup>
                    </Field.Control>
                </Field>

                {UNIT_SETTINGS.map(({ type, label, units }) => (
                    <Field
                        key={type}
                        orientation="vertical"
                        className="mb-3"
                    >
                        <Field.Label className="text-[13px] mb-2">{label}</Field.Label>
                        <Field.Control asChild>
                            <RadioGroup
                                value={settings.units[type]}
                                onValueChange={(value) => handleUpdate(type, value)}
                            >
                                <Grid>
                                    {units.map((unit) => (
                                        <RadioGroup.Item
                                            key={unit}
                                            value={unit}
                                        >
                                            {unit}
                                        </RadioGroup.Item>
                                    ))}
                                </Grid>
                            </RadioGroup>
                        </Field.Control>
                    </Field>
                ))}
            </Panel.Group>
        </Panel>
    );
};
