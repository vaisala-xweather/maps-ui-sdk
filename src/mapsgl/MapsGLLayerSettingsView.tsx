import { type LayerSettings } from '@/types/layer';
import { type ControlSetting, type NormalizedControlSetting } from '@/types/control';
import { Popover } from '@/components/primitives/overlays/popover';
import { PanelList } from '@/components/primitives/layout/panel/PanelList';
import { SIDE, ALIGN } from '@/constants/position';
import { normalizeControlSettings } from '@/utils/control';
import { FadePresence } from '@/components/primitives/animation/Fade';
import { useModalContext } from '@/components/primitives/overlays/modal';
import { Field } from '@/components/compositions/field';
import { PanelItem } from '@/components/primitives/layout/panel/PanelItem';
import { PreferencesFillPartialIcon } from '@/components/compositions/icons/Icon';
import { useMapsGLLayersContext } from './MapsGLLayersProvider';

export interface MapsGLLayerSettingsViewProps {
    id: string;
    title?: string;
    settingsState?: LayerSettings;
    controlSettings: ControlSetting[];
}

export const MapsGLLayerSettingsView = ({
    id,
    title,
    controlSettings
}: MapsGLLayerSettingsViewProps) => {
    const { updateLayerSetting } = useMapsGLLayersContext();
    const { setModalData, modalData } = useModalContext();
    const isOpen = modalData.id === id;
    const popoverClassName = {
        content: `xw-min-w-80 xw-w-80 xw-z-70 xw-bg-black xw-text-xs 
        xw-text-white xw-rounded-xl xw-shadow-xl xw-py-5 xw-px-4`,
        close: `xw-absolute xw-right-3 xw-flex xw-bg-slate-800 
        xw-items-center xw-justify-center xw-w-7 xw-h-7 xw-rounded-full`,
        title: 'xw-mt-1 xw-mb-7 xw-w-full xw-text-[13px] xw-underline xw-underline-offset-4'
    };

    const normalizedControlSettings = normalizeControlSettings(controlSettings);

    const handleValueChange = (
        setting: NormalizedControlSetting,
        newValue: string | number
    ) => {
        updateLayerSetting(id, {
            id: setting.name,
            value: newValue
        });
    };

    return (
        <Popover>
            <Popover.Position
                side={SIDE.right}
                align={ALIGN.start}
                offsetX={28}
                offsetY={12}
            >
                <Popover.Trigger
                    className="xw-text-slate-900 xw-ml-auto"
                    onClick={() => setModalData({ id: isOpen ? '' : id })}
                >
                    <PreferencesFillPartialIcon size={16} />
                </Popover.Trigger>
                <FadePresence isPresent={isOpen}>
                    <Popover.Content
                        isVisibleOverride={isOpen}
                        className={popoverClassName.content}
                    >
                        <Popover.Close
                            className={popoverClassName.close}
                            iconProps={{ size: 10 }}
                            onClick={() => setModalData({ id: '' })}
                        />
                        <Popover.Title className={popoverClassName.title}>
                            {title}
                        </Popover.Title>
                        <PanelList showFirstDivider>
                            {normalizedControlSettings.map(({ className, ...setting }) => (
                                <PanelItem key={setting.name} className="xw-py-2">
                                    <Field
                                        {...setting}
                                        onValueChange={(newValue) => handleValueChange(setting, newValue)}
                                    >
                                        <Field.Label />
                                        <Field.Control className={className} />
                                    </Field>
                                </PanelItem>
                            ))}
                        </PanelList>
                    </Popover.Content>
                </FadePresence>
            </Popover.Position>
        </Popover>
    );
};
