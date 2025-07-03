import { ConditionsProvider, type ConditionsProviderProps } from './ConditionsProvider';
import { ConditionsView } from './ConditionsView';
import { ConditionsTable } from './ConditionsTable';

type ConditionsRootProps = ConditionsProviderProps;

const ConditionsRoot = ({
    children,
    ...rest
}: ConditionsRootProps) => (
    <ConditionsProvider {...rest}>
        {children}
    </ConditionsProvider>
);

ConditionsRoot.displayName = 'Conditions.Root';

type ConditionsProps = ConditionsRootProps;

const Conditions = ({ children, ...rest }: ConditionsProps) => (
    <ConditionsRoot {...rest}>
        {children}
    </ConditionsRoot>
);

Conditions.Provider = ConditionsProvider;
Conditions.View = ConditionsView;
Conditions.Table = ConditionsTable;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { Conditions, type ConditionsProps };

// Context
export { ConditionsContext, useConditionsContext } from './ConditionsProvider';

// Sub-components
export { ConditionsRoot, type ConditionsRootProps };
export { ConditionsProvider, type ConditionsProviderProps } from './ConditionsProvider';
export { ConditionsView } from './ConditionsView';
export { ConditionsTable, type ConditionsTableProps } from './ConditionsTable';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
