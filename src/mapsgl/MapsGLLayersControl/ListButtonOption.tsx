import clsx from 'clsx';
import { HStack } from '@/components/primitives/layout/Stack';
import { LayerButtonOptions } from '@/types/layer';
import { Toggle } from '@/components/primitives/controls/Toggle';
import { ListButtonBase } from './ListButtonBase';

export interface ListButtonOptionProps {
  layer: LayerButtonOptions;
  onClick: () => void;
}

export const ListButtonOption = (props: ListButtonOptionProps) => (
    <ListButtonBase
        {...props}
        renderContent={({ id, label, isActive, onClick, controlView }) => (
            <HStack
                className={clsx(
                    'xw-items-center xw-border xw-rounded xw-px-2',
                    isActive && 'xw-bg-secondary-200'
                )}
            >
                <Toggle
                    id={id}
                    className={clsx(
                        'xw-w-full xw-bg-transparent xw-border-0 xw-px-0 xw-text-xs xw-py-1 xw-text-start',
                        isActive && '!xw-bg-transparent xw-text-slate-900'
                    )}
                    pressed={isActive}
                    onClick={props.onClick || onClick}
                >
                    {label}
                </Toggle>
                {controlView}
            </HStack>
        )}
    />
);
