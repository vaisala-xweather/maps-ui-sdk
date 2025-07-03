/* eslint-disable max-len */

import { Icon, IconProps } from '@xweather/maps-ui-sdk';

export const SearchIcon = (props: IconProps) => (
    <Icon {...props} viewBox="0 0 17 17" color="none">
        <path
            d="M12.6542 11.0544L12.6366 11.0728C12.2093 11.6807 11.6799 12.2099 11.0718 12.6368L11.0542 12.6544L15.3998 17L16.9998 15.4L12.6542 11.0544Z"
            fill="currentColor"/>
        <path
            d="M7.4 13.8C10.9346 13.8 13.8 10.9346 13.8 7.4C13.8 3.86538 10.9346 1 7.4 1C3.86538 1 1 3.86538 1 7.4C1 10.9346 3.86538 13.8 7.4 13.8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"/>
    </Icon>
);

export const StackIcon = (props: IconProps) => (
    <Icon {...props} color="none" strokeColor="currentColor">
        <path d="M2 7L12 1L22 7L12 13L2 7Z" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M22 12L12 18L2 12" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M22 17L12 23L2 17" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
    </Icon>
);

export const GeoLocateIcon = (props: IconProps) => (
    <Icon {...props} viewBox="-2 -1 17 15">
        <path d="M3.49993 13.3875L-6.74687e-05 1.13749C-0.175067 0.437494 0.437432 -0.175006 1.13743 -6.43358e-06L13.3874 3.49999C14.1749 3.76249 14.2624 4.81249 13.4749 5.16249L7.69993 7.69999L5.24993 13.475C4.81243 14.2625 3.76243 14.175 3.49993 13.3875ZM2.18743 2.18749L4.54993 10.5L6.21243 6.64999C6.29993 6.47499 6.47493 6.29999 6.64993 6.21249L10.4999 4.54999L2.18743 2.18749Z" />
    </Icon>
);

export const PreferencesOutlineFullIcon = (props: IconProps) => (
    <Icon {...props} viewBox="0 0 22 22" color="none" strokeColor="currentColor">
        <path d="M12.832 3.66675H21.082" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M0.916016 3.66675H3.66602" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M20.166 11H21.0827" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M0.916016 11H10.9993" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M12.832 18.3335H21.082" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M0.916016 18.3335H3.66602" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M6.41602 6.41675C7.9348 6.41675 9.16602 5.18553 9.16602 3.66675C9.16602 2.14796 7.9348 0.916748 6.41602 0.916748C4.89723 0.916748 3.66602 2.14796 3.66602 3.66675C3.66602 5.18553 4.89723 6.41675 6.41602 6.41675Z" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M13.75 13.75C15.2688 13.75 16.5 12.5188 16.5 11C16.5 9.48122 15.2688 8.25 13.75 8.25C12.2312 8.25 11 9.48122 11 11C11 12.5188 12.2312 13.75 13.75 13.75Z" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M6.41602 21.0835C7.9348 21.0835 9.16602 19.8523 9.16602 18.3335C9.16602 16.8147 7.9348 15.5835 6.41602 15.5835C4.89723 15.5835 3.66602 16.8147 3.66602 18.3335C3.66602 19.8523 4.89723 21.0835 6.41602 21.0835Z" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
    </Icon>
);

export const PreferencesFillPartialIcon = (props: IconProps) => (
    <Icon {...props} viewBox="0 0 16 17">
        <path d="M15 3.5H11C10.4 3.5 10 3.9 10 4.5C10 5.1 10.4 5.5 11 5.5H15C15.6 5.5 16 5.1 16 4.5C16 3.9 15.6 3.5 15 3.5Z" />
        <path d="M5 1.5C3.7 1.5 2.6 2.4 2.2 3.5C2.1 3.5 2.1 3.5 2 3.5H1C0.4 3.5 0 3.9 0 4.5C0 5.1 0.4 5.5 1 5.5H2C2.1 5.5 2.1 5.5 2.2 5.5C2.6 6.6 3.7 7.5 5 7.5C6.7 7.5 8 6.2 8 4.5C8 2.8 6.7 1.5 5 1.5Z" />
        <path d="M1 13.5H5C5.6 13.5 6 13.1 6 12.5C6 11.9 5.6 11.5 5 11.5H1C0.4 11.5 0 11.9 0 12.5C0 13.1 0.4 13.5 1 13.5Z" />
        <path d="M15 11.5H14C13.9 11.5 13.9 11.5 13.8 11.5C13.4 10.3 12.3 9.5 11 9.5C9.3 9.5 8 10.8 8 12.5C8 14.2 9.3 15.5 11 15.5C12.3 15.5 13.4 14.6 13.8 13.5C13.9 13.5 13.9 13.5 14 13.5H15C15.6 13.5 16 13.1 16 12.5C16 11.9 15.6 11.5 15 11.5Z" />
    </Icon>
);

export const AddIcon = (props: IconProps) => (
    <Icon {...props} viewBox="0 0 16 16" strokeColor="currentColor">
        <path d="M8 1.33334V14.6667" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M14.6663 8H1.33301" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
    </Icon>
);

export const SubtractIcon = (props: IconProps) => (
    <Icon {...props} viewBox="0 0 16 16" strokeColor="currentColor">
        <path d="M14.6663 8H1.33301" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
    </Icon>
);

export const LegendIcon = (props: IconProps) => (
    <Icon {...props} viewBox="0 0 18 18" color="none" strokeColor="currentColor">
        <path d="M9 4.5H17.25" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M6 2.25H1.5V6.75H6V2.25Z" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M9 13.5H17.25" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M1.5 11.25L6 15.75" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
        <path d="M6 11.25L1.5 15.75" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
    </Icon>
);

export const TargetIcon = (props: IconProps) => (
    <Icon {...props} viewBox="0 0 24 24" color="none" strokeColor="currentColor">
        <g stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M16.9497 16.9497L20.4852 20.4853" />
            <path d="M3.51465 3.51471L7.05018 7.05024" />
            <path d="M7.05029 16.9497L3.51476 20.4853" />
            <path d="M20.4854 3.51471L16.9498 7.05024" />
        </g>
    </Icon>
);

export const ChevronDownIcon = (props: IconProps) => (
    <Icon {...props} viewBox="0 0 12 7" color="none">
        <path
            d="M0.870522 0.616258C0.84546 0.619509 0.821285 0.627669 0.79938 0.640271C0.777475 0.652873 0.758269 0.66967 0.742861 0.689701L0.0395768 1.60601C0.00865131 1.64642 -0.00499088 1.69745 0.00164023 1.7479C0.00827134 1.79836 0.0346348 1.84412 0.0749525 1.87517L5.88426 6.34559C5.91788 6.37147 5.95911 6.3855 6.00154 6.3855C6.04396 6.3855 6.0852 6.37147 6.11882 6.34559L11.925 1.87709C11.9654 1.84605 11.9917 1.80028 11.9984 1.74982C12.005 1.69937 11.9913 1.64835 11.9604 1.60793L11.2564 0.693162C11.2253 0.652845 11.1796 0.626481 11.1291 0.61985C11.0786 0.613219 11.0276 0.626861 10.9872 0.657786L5.99962 4.49259L1.01241 0.65471C0.972074 0.623603 0.921044 0.609774 0.870522 0.616258Z"
            fill="currentColor"
        />
    </Icon>
);
