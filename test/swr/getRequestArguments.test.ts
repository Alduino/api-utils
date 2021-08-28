import getRequestArguments from "../../src/swr/getRequestArguments";

describe("getRequestArguments", () => {
    it("should return the URL when the request has no body", () => {
        expect(getRequestArguments({}, "foo")).toEqual("foo");
    });

    it("should return an array of [url, body] when the request has a body", () => {
        expect(getRequestArguments({body: "bar"}, "foo")).toEqual([
            "foo",
            "bar"
        ]);
    });
});
