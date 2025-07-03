import { useValueFormatting } from '@/hooks/useValueFormatting';

interface FormattedValueProps {
    className?: string;
    value: number;
    formatter?: (value: number) => string | null | undefined;
}

export const FormattedValue = ({
    value,
    formatter,
    className
}: FormattedValueProps) => {
    const formattedValue = useValueFormatting(value, formatter);

    return (
        <span className={className}>
            {formattedValue}
        </span>
    );
};
