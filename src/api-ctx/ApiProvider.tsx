import {ReactElement, ReactNode, useMemo} from "react";
import {SWRConfiguration} from "swr";
import ApiContextType from "./ApiContextType";
import ApiContext from "./context";

export interface ApiProviderProps {
    baseUrl: string;
    swrConfig?: SWRConfiguration;
    children: ReactNode;
}

export function ApiProvider({
    baseUrl,
    swrConfig,
    children
}: ApiProviderProps): ReactElement {
    const contextValue = useMemo<ApiContextType>(
        () => ({
            baseUrl,
            swrConfig: swrConfig ?? {}
        }),
        [baseUrl, swrConfig]
    );

    return (
        <ApiContext.Provider value={contextValue}>
            {children}
        </ApiContext.Provider>
    );
}
