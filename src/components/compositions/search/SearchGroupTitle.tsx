import clsx from 'clsx';
import { Heading, type HeadingProps } from '@/components/primitives/text/Heading';

export type SearchGroupTitleProps = HeadingProps;

export const SearchGroupTitle = ({
    children,
    className = 'xw-text-base xw-font-semibold xw-mb-1'
}: SearchGroupTitleProps) => (
    <Heading className={clsx('xw-search-group-title', className)}>{children}</Heading>
);

SearchGroupTitle.displayName = 'Search.GroupTitle';
