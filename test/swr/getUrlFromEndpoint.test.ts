import getUrlFromEndpoint from "../../src/swr/getUrlFromEndpoint";

describe("getUrlFromEndpoint", () => {
    it("correctly joins together a base url with no path and a relative path", () => {
        const endpoint = {getKey: () => "my/relative/path"};
        const baseUrl = "https://example.com/";
        expect(getUrlFromEndpoint(endpoint, {}, baseUrl)).toEqual(
            "https://example.com/my/relative/path"
        );
    });

    it("correctly joins together a base url with no path and an absolute path", () => {
        const endpoint = {getKey: () => "/my/absolute/path"};
        const baseUrl = "https://example.com/";
        expect(getUrlFromEndpoint(endpoint, {}, baseUrl)).toEqual(
            "https://example.com/my/absolute/path"
        );
    });

    it("correctly joins together a base url with a path and a relative path", () => {
        const endpoint = {getKey: () => "my/relative/path"};
        const baseUrl = "https://example.com/path/";
        expect(getUrlFromEndpoint(endpoint, {}, baseUrl)).toEqual(
            "https://example.com/path/my/relative/path"
        );
    });

    it("correctly joins together a base url with a path and an absolute path", () => {
        const endpoint = {getKey: () => "/my/absolute/path"};
        const baseUrl = "https://example.com/path/";
        expect(getUrlFromEndpoint(endpoint, {}, baseUrl)).toEqual(
            "https://example.com/my/absolute/path"
        );
    });

    it("passes the request object into getKey()", () => {
        const endpoint = {getKey: (v: string) => `path/with/${v}`};
        const baseUrl = "https://example.com/";
        expect(getUrlFromEndpoint(endpoint, "TEST", baseUrl)).toEqual(
            "https://example.com/path/with/TEST"
        );
    });

    it("throws if the base url has no path and does not end in a slash", () => {
        const endpoint = {getKey: () => ""};
        const baseUrl = "https://example.com";
        expect(() => getUrlFromEndpoint(endpoint, {}, baseUrl)).toThrow(
            "Invariant failed: Base URL must end with a forward slash (`/`) to prevent issues with relative paths"
        );
    });

    it("throws if the base url has a path and does not end in a slash", () => {
        const endpoint = {getKey: () => ""};
        const baseUrl = "https://example.com/path";
        expect(() => getUrlFromEndpoint(endpoint, {}, baseUrl)).toThrow(
            "Invariant failed: Base URL must end with a forward slash (`/`) to prevent issues with relative paths"
        );
    });
});
