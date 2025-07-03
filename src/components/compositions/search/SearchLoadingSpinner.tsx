import clsx from 'clsx';
import { useLoadingContext } from '@/providers/LoadingProvider';
import { LoadingSpinner } from '@/components/primitives/animation/LoadingSpinner';

export interface SearchLoadingSpinnerProps {
    className?: string;
}

export const SearchLoadingSpinner = ({ className }: SearchLoadingSpinnerProps) => {
    const { loading } = useLoadingContext();

    return (
        <LoadingSpinner
            size={16}
            className={clsx(
                'xw-search-loading-spinner xw-shrink-0',
                loading ? 'xw-visible' : 'xw-invisible',
                className
            )}
            isAnimating={loading}
        />
    );
};

SearchLoadingSpinner.displayName = 'Search.LoadingSpinner';
