import {key} from "../src";

describe("key function", () => {
    it("doesn't do anything without template parameters", () => {
        expect(key`/foo/bar`).toEqual("/foo/bar");
    });

    it("handles a key with just a query object", () => {
        expect(key`/foo?${{bar: "baz"}}`).toEqual("/foo?bar=baz");
    });

    it("handles a key with just url parameters", () => {
        expect(key`/foo/${"bar"}/${"baz"}`).toEqual("/foo/bar/baz");
    });

    it("handles a key with both url parameters and a query object", () => {
        expect(key`/foo/${"bar"}?${{baz: "1"}}`).toEqual("/foo/bar?baz=1");
    });

    it("handles a key that is just a query object", () => {
        expect(key`?${{foo: "bar"}}`).toEqual("?foo=bar");
    });

    it("handles a key that is just a url parameter", () => {
        expect(key`${"bar"}`).toEqual("bar");
    });

    it("removes the `?` from an empty query object", () => {
        expect(key`/foo/bar?${{}}`).toEqual("/foo/bar");
    });

    it("throws when a key ends in `?` without a query object and with no url parameters", () => {
        expect(() => key`foo/bar?`).toThrow(
            "Invariant failed: Key must not end with `?` if there is no query object"
        );
    });

    it("throws when a key ends in `?` without a query object and with a url parameter", () => {
        expect(() => key`foo/${"bar"}/baz?`).toThrow(
            "Invariant failed: Key must not end with `?` if there is no query object"
        );
    });

    it("throws when a key has a query object but does not end in `?`", () => {
        expect(() => key`foo/bar${{baz: "1"}}`).toThrow(
            "Invariant failed: Key must end with `?` if there is a query object"
        );
    });
});
