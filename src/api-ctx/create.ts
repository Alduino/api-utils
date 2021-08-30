import ApiContext, {ApiContextImpl} from "./ApiContext";

/**
 * Creates a new API context. Should only be done once per library.
 * The return value of this function should be set as the `apiContext` property on all endpoints.
 */
export default function createContext(): ApiContext {
    return new ApiContextImpl();
}
