import {SWRConfiguration} from "swr";

export default interface ApiContextType {
    baseUrl: string;
    swrConfig: SWRConfiguration;
}
