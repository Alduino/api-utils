import invariant from "tiny-invariant";

export type Param = string | number | boolean;
export type ParamRecord = Record<string, Param | undefined | null>;

/**
 * Takes in a tag of form `path/with/${values}/${inside}/and?${{queries}}`.
 * Fills values with URL encoding, and adds query string.
 * @remarks If there is never any query values, you can omit the question mark and the queries object.
 */
export default function key(
    strings: TemplateStringsArray,
    ...params: [...Param[], ParamRecord] | Param[]
): string {
    const hasQuery = typeof params[params.length - 1] === "object";

    // split out middle and last arguments
    const inUrlParams = hasQuery
        ? (params.slice(0, params.length - 1) as Param[])
        : (params as Param[]);
    const queryParams = hasQuery
        ? (params[params.length - 1] as ParamRecord)
        : {};

    const result: string[] = new Array(strings.length * 2 - 1);

    // zip together strings and inUrlParams
    const loopCount = hasQuery ? strings.length - 2 : strings.length - 1;
    for (let i = 0; i < loopCount; i++) {
        const offset = i * 2;
        result[offset] = strings[i];
        result[offset + 1] = encodeURIComponent(inUrlParams[i].toString());
    }

    // some string that should end with `?` (the last part of the path, e.g. `/and?`)
    // if hasQuery is true, and should NOT end with that if it is false.
    // (last part element of strings is just empty (it is the one after the query obj))
    const pathEndString = hasQuery
        ? strings[strings.length - 2]
        : strings[strings.length - 1];

    if (hasQuery) {
        invariant(
            pathEndString.endsWith("?"),
            "Key must end with `?` if there is a query object"
        );

        // filter out query params that are `undefined`, then turn them into strings
        const mappedParams = Object.entries(queryParams)
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, (v as Param).toString()]);

        // add query to the end
        if (mappedParams.length > 0) {
            const queryString = new URLSearchParams(mappedParams).toString();
            result[result.length - 1] = `${pathEndString}${queryString}`;
        } else {
            // add back the last part of the path, without the `?`
            result[result.length - 1] = pathEndString.substring(
                0,
                pathEndString.length - 1
            );
        }
    } else if (params.length < strings.length) {
        invariant(
            !pathEndString.endsWith("?"),
            "Key must not end with `?` if there is no query object"
        );

        result[result.length - 1] = strings[strings.length - 1];
    }

    return result.join("");
}
