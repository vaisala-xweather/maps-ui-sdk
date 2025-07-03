import clsx from 'clsx';
import { Hr } from '@/components/primitives/layout/Hr';

export interface SearchDividerProps {
    className?: string;
}

export const SearchDivider = ({ className = '' }: SearchDividerProps) => (
    <Hr
        className={clsx('xw-search-divider', className)}
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
    />
);

SearchDivider.displayName = 'Search.Divider';
