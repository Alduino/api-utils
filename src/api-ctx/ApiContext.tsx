import {createContext, ReactElement, ReactNode, useContext, useMemo} from "react";
import ApiContextType from "./ApiContextType";
import {SWRConfiguration} from "swr";

export interface ApiProviderProps {
    baseUrl: string;
    swrConfig?: SWRConfiguration;
    children: ReactNode;
}

export default interface ApiContext {
    use(): ApiContextType | null;
    Provider(props: ApiProviderProps): ReactElement;
}

export class ApiContextImpl implements ApiContext {
    private context = createContext<ApiContextType | null>(null);

    use(): ApiContextType | null {
        return useContext(this.context);
    }

    Provider({baseUrl, swrConfig, children}: ApiProviderProps): ReactElement {
        const contextValue = useMemo<ApiContextType>(
            () => ({
                baseUrl,
                swrConfig: swrConfig ?? {}
            }),
            [baseUrl, swrConfig]
        );

        return (
            <this.context.Provider value={contextValue}>
                {children}
            </this.context.Provider>
        );
    }
}
