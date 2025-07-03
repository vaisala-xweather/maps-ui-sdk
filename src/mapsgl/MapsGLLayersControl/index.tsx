import { LayersConfig } from '@/types/layer';
import { ButtonBase } from './ButtonBase';
import { MapsGLLayerSettingsView, type MapsGLLayerSettingsViewProps } from '../MapsGLLayerSettingsView';
import { ListButton } from './ListButton';
import { ListButtonBase } from './ListButtonBase';
import { ListButtonOption } from './ListButtonOption';
import { ListButtonOptionsContainer } from './ListButtonOptionsContainer';
import { ListButtonGroup } from './ListButtonGroup';
import { ListItem } from './ListItem';
import { ListGroup } from './ListGroup';
import { ListControl } from './ListControl';
import { Divider } from './Divider';

interface MapsGLLayersControlProps {
    config: LayersConfig
}

const MapsGLLayersControl = ({ config }: MapsGLLayersControlProps) => (
    <ListControl config={config} />
);

MapsGLLayersControl.ListControl = ListControl;
MapsGLLayersControl.ListGroup = ListGroup;
MapsGLLayersControl.ListItem = ListItem;
MapsGLLayersControl.ListButton = ListButton;
MapsGLLayersControl.ListButtonGroup = ListButtonGroup;
MapsGLLayersControl.ButtonBase = ButtonBase;
MapsGLLayersControl.ListButtonSettingsView = MapsGLLayerSettingsView;
MapsGLLayersControl.ListButtonBase = ListButtonBase;
MapsGLLayersControl.ListButtonOption = ListButtonOption;
MapsGLLayersControl.ListButtonOptionsContainer = ListButtonOptionsContainer;
MapsGLLayersControl.Divider = Divider;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { MapsGLLayersControl, type MapsGLLayersControlProps };

// Sub-components
export { ButtonBase, type ButtonBaseProps } from './ButtonBase';
export {
    MapsGLLayerSettingsView as ListButtonSettingsView,
    type MapsGLLayerSettingsViewProps as ListButtonSettingsViewProps
} from '../MapsGLLayerSettingsView';
export { ListButton, type ListButtonProps } from './ListButton';
export { ListButtonBase, type ListButtonBaseProps } from './ListButtonBase';
export { ListButtonOption, type ListButtonOptionProps } from './ListButtonOption';
export { ListButtonOptionsContainer, type ListButtonOptionsContainerProps } from './ListButtonOptionsContainer';
export { ListButtonGroup, type ListButtonGroupProps } from './ListButtonGroup';
export { ListItem, type ListItemProps } from './ListItem';
export { ListGroup, type ListGroupProps } from './ListGroup';
export { ListControl, type ListControlProps } from './ListControl';
export { Divider, type DividerProps } from './Divider';

// Hooks
export { useLayerControl } from './useLayerControl';
export { useLayerGroupControl } from './useLayerGroupControl';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
