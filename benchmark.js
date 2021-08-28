const b = require("benny");
const {key} = require("./dist");

const emptyObj = {};
const queryObj = {bar: "baz"};

b.suite("`key` function",
    b.add("without template parameters", () => key`/foo/bar`),
    b.add("just a query object", () => key`/foo?${queryObj}`),
    b.add("just url parameters", () => key`/foo/${"bar"}/${"baz"}`),
    b.add("both url parameters and a query object", () => key`/foo/${"bar"}?${queryObj}`),
    b.add("just a url parameter", () => key`${"bar"}`),
    b.add("empty query object", () => key`/foo/bar?${emptyObj}`),
    b.cycle(),
    b.complete()
);
