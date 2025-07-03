import { Fragment, useEffect } from 'react';
import { useModalContext } from '@/components/primitives/overlays/modal/ModalProvider';
import { LayersConfig } from '@/types/layer';
import { ListGroup } from './ListGroup';
import { ListItem } from './ListItem';
import { Divider } from './Divider';

export interface ListControlProps {
    config: LayersConfig;
}

export const ListControl = ({ config }: ListControlProps) => {
    const { setModalData } = useModalContext();

    useEffect(() => () => setModalData({ id: '' }), [setModalData]);

    return (
        <>
            {config.map((item, index) => (
                <Fragment key={index}>
                    {index === 0 && <Divider />}
                    {'group' in item && item.group ? (
                        <ListGroup item={item} />
                    ) : (
                        <ListItem item={item} />
                    )}
                </Fragment>
            ))}
        </>
    );
};
