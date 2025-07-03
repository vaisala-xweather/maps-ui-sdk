import clsx from 'clsx';
import { ExpandCollapseVertical } from '@/components/primitives/animation/ExpandCollapseVertical';
import { HStack, VStack } from '@/components/primitives/layout/Stack';
import { LayerSegmentedButtonOptions } from '@/types/layer';
import { ButtonBase } from './ButtonBase';
import { useLayerGroupControl } from './useLayerGroupControl';
import { ListButtonOptionsContainer } from './ListButtonOptionsContainer';
import { ListButtonOption } from './ListButtonOption';

export interface ListButtonGroupProps {
    item: LayerSegmentedButtonOptions
}

export const ListButtonGroup = ({ item }: ListButtonGroupProps) => {
    const { id, options, multiselect, title, selected } = item;
    const { isActive, handleToggle, handleOptionClick } = useLayerGroupControl(
        options,
        multiselect,
        selected
    );

    return (
        <VStack

        >
            <HStack className={clsx(
                'xw-items-center xw-overflow-hidden',
                isActive
                    ? 'xw-bg-white xw-text-slate-800'
                    : 'xw-bg-transparent xw-text-white'
            )}>
                <ButtonBase
                    id={id}
                    className={clsx(isActive && 'xw-font-bold')}
                    label={title}
                    onClick={handleToggle}
                />
            </HStack>
            <ExpandCollapseVertical expanded={isActive}>
                <ListButtonOptionsContainer>
                    {options.map((option, index) => (
                        <ListButtonOption
                            key={index}
                            layer={option}
                            onClick={() => handleOptionClick(option.id)}
                        />
                    ))}
                </ListButtonOptionsContainer>
            </ExpandCollapseVertical>
        </VStack>
    );
};
