import clsx from 'clsx';
import { Button } from '@/components/primitives/buttons/Button';

export interface ButtonBaseProps {
  id: string;
  label: string;
  className?: string;
  onClick: () => void;
}

export const ButtonBase = ({
    id,
    label,
    onClick,
    className = ''
}: ButtonBaseProps) => (
    <Button
        id={id}
        className={clsx('xw-px-4 xw-py-1.5 xw-w-full xw-text-xs xw-text-left', className)}
        onClick={onClick}
    >
        {label}
    </Button>
);
