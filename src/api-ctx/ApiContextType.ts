import {UseAsyncCallbackOptions} from "react-async-hook";
import {SWRConfiguration} from "swr";

export default interface ApiContextType {
    baseUrl: string;
    swrConfig: SWRConfiguration;
    fetchConfig: UseAsyncCallbackOptions<never>;
}
