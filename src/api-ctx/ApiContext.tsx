import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useMemo
} from "react";
import {UseAsyncCallbackOptions} from "react-async-hook";
import {SWRConfiguration} from "swr";
import ApiContextType from "./ApiContextType";

export interface ApiProviderProps {
    baseUrl: string;
    swrConfig?: SWRConfiguration;
    fetchConfig?: UseAsyncCallbackOptions<never>;
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

    Provider({
        baseUrl,
        swrConfig,
        fetchConfig,
        children
    }: ApiProviderProps): ReactElement {
        const contextValue = useMemo<ApiContextType>(
            () => ({
                baseUrl,
                swrConfig: swrConfig ?? {},
                fetchConfig: fetchConfig ?? {}
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
