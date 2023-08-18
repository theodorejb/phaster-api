type FetchFunc = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
let apiFetch: FetchFunc | null = null;

// allow overriding fetch function to support server-side rendering
export function setFetch(fetchFunc: FetchFunc | null) {
    apiFetch = fetchFunc;
}

export class RequestError extends Error {
    public response: Response;

    constructor(message: string, response: Response) {
        super(message);
        this.name = this.constructor.name;
        this.response = response;
    }
}

export async function request(endpoint: string, init?: RequestInit) {
    if (!apiFetch) {
        apiFetch = window.fetch;
    }

    return apiFetch(endpoint, init).then(async (resp) => {
        const isJson = resp.headers.get("Content-Type") === "application/json";
        const data = isJson ? await resp.json() : resp.body;

        if (!resp.ok) {
            let error = resp.statusText;

            if (isJson && data.error) {
                error = data.error;
            }

            throw new RequestError(error, resp);
        }

        return data;
    });
}
