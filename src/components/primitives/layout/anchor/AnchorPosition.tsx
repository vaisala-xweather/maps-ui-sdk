import { PositionProvider, PositionProviderProps } from '@/providers/PositionProvider';

export type AnchorPositionProps = PositionProviderProps;

export const AnchorPosition = (props: AnchorPositionProps) => (
    <PositionProvider {...props} />
);
