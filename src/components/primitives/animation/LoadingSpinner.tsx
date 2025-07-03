import clsx from 'clsx';

export interface LoadingSpinnerProps {
    className?: string;
    size?: number;
    color?: string;
    strokeWidth?: number;
    isAnimating?: boolean;
}

export const LoadingSpinner = ({
    className = '',
    size = 24,
    color = '#19a6e1',
    strokeWidth = 2,
    isAnimating = true
}: LoadingSpinnerProps) => (
    <svg
        className={clsx(
            'xw-loading-spinner xw-pointer-events-none',
            isAnimating && 'xw-animate-spin',
            className
        )}
        viewBox="0 0 50 50"
        width={size}
        height={size}
    >
        <circle
            className="xw-loading-spinner-circle"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
        />
    </svg>
);
