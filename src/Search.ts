import { SearchResponse } from "./Endpoint";

export function getApiParams(params: URLSearchParams, defaultLimit = 25) {
    const limit = +(params.get("limit") ?? defaultLimit);
    const page = +(params.get("page") ?? 1);
    const offset = limit * page - limit;
    const apiParams = new URLSearchParams();
    apiParams.set("limit", limit.toString());
    apiParams.set("offset", offset.toString());

    // add any sort params
    params.forEach((value, key) => {
        if (key.startsWith("sort[")) {
            apiParams.set(key, value);
        }
    });

    return {
        apiParams,
        limit,
        page,
    };
}

export function hasSortParam(params: URLSearchParams) {
    for (const param of params) {
        if (param[0].startsWith("sort[")) {
            return true;
        }
    }

    return false;
}

export interface SearchPageData<T> {
    items: T[];
    params: { [key: string]: string };
    pages: number;
    page: number;
    limit: number;
    error: string;
}

export async function getSearchData<T>(
    response: Promise<SearchResponse<T>>,
    params: URLSearchParams,
    limit: number,
    page: number,
): Promise<SearchPageData<T>> {
    let items: T[] = [];
    let lastPage = true;
    let error = "";

    try {
        const resp = await response;
        items = resp.data;
        lastPage = resp.lastPage;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        error = e.message;
    }

    return {
        items,
        params: Object.fromEntries(params),
        pages: lastPage ? page : page + 1,
        page,
        limit,
        error,
    };
}
