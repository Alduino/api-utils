export default interface RequestLoader<Request, Response> {
    (idx: number, prevResponse: Response | null): Request | null;
}
