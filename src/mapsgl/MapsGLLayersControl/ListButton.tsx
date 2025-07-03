import clsx from 'clsx';
import { HStack } from '@/components/primitives/layout/Stack';
import { LayerButtonOptions } from '@/types/layer';
import { ListButtonBase } from './ListButtonBase';
import { ButtonBase } from './ButtonBase';

export interface ListButtonProps {
    layer: LayerButtonOptions;
}

export const ListButton = (props: ListButtonProps) => (
    <ListButtonBase
        {...props}
        renderContent={({ id, label, isActive, onClick, controlView }) => (
            <HStack
                className={clsx(
                    'xw-items-center xw-transition-colors xw-duration-200 xw-overflow-hidden',
                    controlView && 'xw-pr-4',
                    isActive ? 'xw-bg-white xw-text-slate-800' : 'xw-bg-transparent xw-text-white'
                )}
            >
                <ButtonBase
                    id={id}
                    className="xw-py-1.5"
                    label={label}
                    onClick={() => onClick(id)}
                />
                {controlView}
            </HStack>
        )}
    />
);
