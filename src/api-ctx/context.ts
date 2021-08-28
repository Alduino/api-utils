import {createContext} from "react";
import ApiContextType from "./ApiContextType";

const ApiContext = createContext<ApiContextType | null>(null);
export default ApiContext;
