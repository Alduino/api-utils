import {useContext} from "react";
import ApiContextType from "./ApiContextType";
import ApiContext from "./context";

export default function useApiContext(): ApiContextType | null {
    return useContext(ApiContext);
}
