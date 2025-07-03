import { ReactNode, useState, createContext, useContext } from 'react';

export interface ModalData {
  id: string | null
  rect?: DOMRect | null
}

export const ModalDataDefault: ModalData = {
    id: null,
    rect: null
};

export interface ModalContextType {
  modalData: ModalData
  setModalData: (data: ModalData) => void,
  hideModal: () => void
}

export const ModalContext = createContext<ModalContextType>({
    modalData: ModalDataDefault,
    setModalData: () => {},
    hideModal: () => ModalDataDefault
});

export const useModalContext = () => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }

    return context;
};

export interface ModalProviderProps {
    children: ReactNode,
}

export const ModalProvider = ({
    children
}: ModalProviderProps) => {
    const [modalData, setModalData] = useState<ModalData>(ModalDataDefault);

    const hideModal = () => {
        setModalData(ModalDataDefault);
    };

    const value: ModalContextType = {
        modalData,
        setModalData,
        hideModal
    };

    return (<ModalContext.Provider value={value}>
        {children}
    </ModalContext.Provider>);
};
ModalProvider.displayName = 'Modal.Provider';
