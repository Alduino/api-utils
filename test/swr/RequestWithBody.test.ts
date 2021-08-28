import {isRequestWithBody} from "../../src/swr/RequestWithBody";

describe("isRequestWithBody", () => {
    it("should return false if there is no body property", () => {
        expect(isRequestWithBody({})).toBeFalsy();
    });

    it("should return false if the value is not an object", () => {
        expect(isRequestWithBody("foo")).toBeFalsy();
    });

    it("should return true if there is a body property", () => {
        expect(isRequestWithBody({body: "bla"})).toBeTruthy();
    });

    it("should return true if the body property is undefined", () => {
        expect(isRequestWithBody({body: undefined})).toBeTruthy();
    });
});
