import { LayerButtonOptions } from '@/types/layer';
import { useModalContext } from '@/components/primitives/overlays/modal';
import { useLayerControl } from './useLayerControl';
import { MapsGLLayerSettingsView } from '../MapsGLLayerSettingsView';

export interface ListButtonBaseProps {
  layer: LayerButtonOptions;
  renderContent: (props: {
    id: string;
    label: string;
    isActive: boolean;
    controlView: JSX.Element | null;
    onClick: (layerId?: string) => void;
  }) => JSX.Element;
}

export const ListButtonBase = ({
    layer,
    renderContent
}: ListButtonBaseProps) => {
    const { id, title } = layer;
    const { hideModal } = useModalContext();
    const { isActive, toggleLayer, controlSettings, settingsState } = useLayerControl(layer);

    const controlView = isActive && controlSettings ? (
        <MapsGLLayerSettingsView
            id={id}
            title={title}
            controlSettings={controlSettings}
            settingsState={settingsState}
        />
    ) : null;

    const handleClick = (layerId?: string) => {
        toggleLayer(layerId);
        hideModal();
    };

    return renderContent({ id, label: title, isActive, onClick: handleClick, controlView });
};
