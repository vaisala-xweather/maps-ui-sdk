import { ViewBoxDimensions } from '@/types/svg';
import { CSSUnit } from '@/constants/css';
import { isValidCSSUnit } from '@/utils/css';
import InvalidDimensionError from '@/utils/error/invalidDimension';
import InvalidUnitError from '@/utils/error/invalidUnitError';
import InvalidViewBoxFormat from '@/utils/error/invalidViewBoxFormat';

export const parseViewBox = (viewBox: string): ViewBoxDimensions => {
    const parts = viewBox.split(/\s+/, 4).map(Number);

    if (parts.length === 4 && parts.every((part) => !Number.isNaN(part))) {
        const [minX, minY, width, height] = parts;
        return { minX, minY, width, height };
    }
    throw new InvalidViewBoxFormat(viewBox);
};

export const extractDimensionsAndUnits = (
    dimensions: (string | number)[]
): { value: number; unit: CSSUnit | null }[] => dimensions.map((dimension) => extractDimensionAndUnit(dimension));

export const extractDimensionAndUnit = (
    dimension: string | number
): { value: number; unit: CSSUnit | null } => {
    let value: number;
    let unit: CSSUnit | null = null;

    if (typeof dimension === 'number') {
        value = dimension;
    } else {
        const DIMENSION_REGEX = /^(\d*\.?\d+)(.*)/;
        const matches = dimension.match(DIMENSION_REGEX);

        if (!matches) {
            throw new InvalidDimensionError(dimension);
        }

        value = Number.parseFloat(matches[1]);
        const extractedUnit = matches[2];
        const validCSSUnits = Object.values(CSSUnit);

        if (extractedUnit !== '' && !isValidCSSUnit(extractedUnit)) {
            throw new InvalidUnitError({ type: 'invalidValue', unit: extractedUnit, validUnits: validCSSUnits });
        }

        if (extractedUnit && validCSSUnits.includes(extractedUnit)) {
            unit = extractedUnit;
        }
    }

    return { value, unit };
};

export const calculateDimensionsFromSize = (
    size: string | number,
    width: string | number,
    height: string | number
): { newWidth: string; newHeight: string; unit: CSSUnit } => {
    const [{
        value: sizeValue,
        unit: sizeUnit
    }, {
        value: widthValue,
        unit: widthUnit
    }, {
        value: heightValue,
        unit: heightUnit
    }] = extractDimensionsAndUnits([size, width, height]);

    const units = [sizeUnit, widthUnit, heightUnit].filter((x) => x !== null);
    const uniqueUnits = new Set(units);

    if (uniqueUnits.size > 1) {
        throw new InvalidUnitError({ type: 'mixedUnits' });
    }

    const unit = uniqueUnits.values().next().value ?? CSSUnit.px;
    const aspectRatio = widthValue / heightValue;

    const newWidth = aspectRatio >= 1 ? sizeValue : sizeValue * aspectRatio;
    const newHeight = aspectRatio < 1 ? sizeValue : sizeValue / aspectRatio;

    return {
        newWidth: `${newWidth}${unit}`,
        newHeight: `${newHeight}${unit}`,
        unit
    };
};
