import { LayersConfigItem, LayerButtonOptions } from '@/types/layer';
import { ListButtonGroup } from './ListButtonGroup';
import { ListButton } from './ListButton';
import { Divider } from './Divider';

export interface ListItemProps {
    item: LayersConfigItem
}

export const ListItem = ({ item }: ListItemProps) => (
    <>
        {
            'options' in item && item.options?.length > 0 ? (
                <ListButtonGroup item={item}/>
            ) : (
                <ListButton layer={item as LayerButtonOptions} />
            )
        }
        <Divider />
    </>

);
