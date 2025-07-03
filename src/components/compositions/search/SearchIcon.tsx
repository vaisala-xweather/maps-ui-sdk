import clsx from 'clsx';
import { Icon, type IconProps } from '@/components/primitives/display/Icon';

export type SearchIconProps = IconProps;

export const SearchIcon = ({
    color = 'none',
    className,
    ...rest
}: IconProps) => (
    <Icon
        viewBox="0 0 17 17"
        color={color}
        className={clsx('xw-search-icon xw-shrink-0', className)}
        {...rest}
    >
        <path
            d="M12.6542 11.0544L12.6366 11.0728C12.2093 11.6807 11.6799 12.2099
            11.0718 12.6368L11.0542 12.6544L15.3998 17L16.9998 15.4L12.6542 11.0544Z"
            fill="currentColor"
        />
        <path
            d="M7.4 13.8C10.9346 13.8 13.8 10.9346 13.8 7.4C13.8 3.86538 10.9346
            1 7.4 1C3.86538 1 1 3.86538 1 7.4C1 10.9346 3.86538 13.8 7.4 13.8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
        />
    </Icon>
);

SearchIcon.displayName = 'Search.Icon';
