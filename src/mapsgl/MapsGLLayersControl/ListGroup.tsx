import { VStack } from '@/components/primitives/layout/Stack';
import { LayersConfigItem } from '@/types/layer';
import { ListItem } from './ListItem';
import { Divider } from './Divider';

export interface ListGroupProps {
    item: LayersConfigItem
}

export const ListGroup = ({ item }: ListGroupProps) => (
    <VStack className="xw-mb-3 xw-pt-8">
        <h3 className="xw-text-xl xw-mb-2 xw-px-4">{item.title}</h3>
        <VStack>
            <Divider />
            {'group' in item && item.group?.map((groupItem, itemIndex) => (
                <ListItem key={itemIndex} item={groupItem} />
            ))}
        </VStack>
    </VStack>
);
