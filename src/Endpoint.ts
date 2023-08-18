type RequestFunc = (input: string, init?: RequestInit) => Promise<any>;

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

type AtLeastOne<T> = { [P in keyof T]: Pick<Required<T>, P> }[keyof T];
type AffectedResp = Promise<{ affected: number }>;

export interface SearchResponse<T> {
    offset: number;
    limit: number;
    lastPage: boolean;
    data: T[];
}

export class Endpoint<T extends { id: number | string }> {
    constructor(
        readonly endpoint: string,
        private req: RequestFunc,
    ) {}

    public search(params: URLSearchParams): Promise<SearchResponse<T>> {
        return this.req(`${this.endpoint}?${params}`);
    }

    public getById(id: number | string): Promise<T> {
        return this.req(`${this.endpoint}/${id}`);
    }

    public postAll(entities: T[]): Promise<T[]> {
        return this.req(this.endpoint, { method: "POST", body: JSON.stringify(entities) }).then(
            (data: { ids: number[] }) => {
                return data.ids.map((id, index) => ({ ...entities[index], id }));
            },
        );
    }

    public post(entity: T): Promise<T> {
        return this.req(this.endpoint, { method: "POST", body: JSON.stringify(entity) }).then(
            (data: { id: number }) => ({ ...entity, id: data.id }),
        );
    }

    public put(entity: T): AffectedResp {
        const id = entity.id;
        return this.req(`${this.endpoint}/${id}`, { method: "PUT", body: JSON.stringify(entity) });
    }

    public save(entity: T): Promise<T> {
        if (entity.id) {
            return this.put(entity).then(() => entity);
        } else {
            return this.post(entity);
        }
    }

    public patch(id: number | string, patch: AtLeastOne<RecursivePartial<T>>): AffectedResp {
        return this.req(`${this.endpoint}/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    }

    public delete(id: number | string): Promise<null> {
        return this.req(`${this.endpoint}/${id}`, { method: "DELETE" });
    }
}
