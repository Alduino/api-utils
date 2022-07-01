import {doWithRetries} from "../retry";
import Endpoint from "./Endpoint";

export default function fetchWithRetries<Request, Response>(endpoint: Endpoint<Request, Response>, args: [string, unknown?]): Promise<Response> {
    const fn = async () => await endpoint.fetch(...args);

    if (endpoint.retry) {
        return doWithRetries(fn, endpoint.retry);
    } else {
        return fn();
    }
}
