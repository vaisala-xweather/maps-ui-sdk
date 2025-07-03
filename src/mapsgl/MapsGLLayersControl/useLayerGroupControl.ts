import { useState, useRef } from 'react';
import { LayerButtonSegmentOptions } from '@/types/layer';
import { useMapsGLLayersContext } from '@/mapsgl/MapsGLLayersProvider';
import { useModalContext } from '@/components/primitives/overlays/modal';

/**
 * Custom hook for managing a group of map layers with toggle functionality.
 * Allows for single or multiple layer selection within a group, maintaining
 * the selected state of the options across group selection state changes.
 *
 * @param options - Array of layer options defining the available layers in the group
 * @param multiselect - When true, allows multiple layers to be active simultaneously.
 *                      When false, only one layer can be active at a time
 * @param selected - Initial selected state of the layer group
 */
export const useLayerGroupControl = (
    options: LayerButtonSegmentOptions[],
    multiselect?: boolean,
    selected?: boolean
) => {
    const { hideModal } = useModalContext();
    const { layers, toggleLayer } = useMapsGLLayersContext();

    const selectedOptionsRef = useRef<Array<string>>(
        options
            .filter((option) => option.selected)
            .map((option) => option.id)
    );

    const [isActive, setIsActive] = useState(selected ?? false);

    const handleToggle = () => {
        if (isActive) {
            options.forEach((option) => {
                if (layers[option.id]?.active) {
                    toggleLayer(option.id);
                }
            });
        } else {
            selectedOptionsRef.current.forEach((optionId) => {
                if (!layers[optionId]?.active) {
                    toggleLayer(optionId);
                }
            });
        }
        setIsActive(!isActive);
        hideModal();
    };

    const handleOptionClick = (optionId: string) => {
        const isCurrentlyActive = layers[optionId]?.active;

        if (multiselect) {
            if (isCurrentlyActive) {
                selectedOptionsRef.current = selectedOptionsRef.current.filter((id) => id !== optionId);
            } else {
                selectedOptionsRef.current.push(optionId);
            }
        } else {
            options.forEach((option) => {
                if (option.id !== optionId && layers[option.id]?.active) {
                    toggleLayer(option.id);
                }
            });
            selectedOptionsRef.current = isCurrentlyActive ? [] : [optionId];
        }
        toggleLayer(optionId);
    };

    return {
        isActive,
        handleToggle,
        handleOptionClick
    };
};
