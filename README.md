# Phaster API

Easily integrate with API endpoints built with [Phaster](https://github.com/theodorejb/phaster).

## Installation

`npm install phaster-api`

## Usage

```ts
import { Endpoint, request } from "phaster-api";
```

The `request` function is a small wrapper around `fetch` which automatically parses JSON responses.

The `Endpoint` class simplifies requests to Phaster API endpoints:

```ts
const users = new Endpoint<User>("/api/users", request);
```

Each `Endpoint` instance has the following methods:

### `search(params: URLSearchParams): Promise<SearchResponse<T>>`

Make a `GET` request to search entities.

### `getById(id: number | string): Promise<T>`

Return a single entity by ID.

### `postAll(entities: T[]): Promise<T[]>`

Create multiple entities with a single request. Returns the saved entities with their ID.

### `post(entity: T): Promise<T>`

Create a single entity. Returns the saved entity with its ID.

### `put(entity: T): Promise<{ affected: number }>`

Replace all writable properties on a single entity.

### `save(entity: T): Promise<T>`

Automatically call `post` or `put` depending on whether the entity has an ID, and return the saved entity with its ID.

### `patch(id: number | string, patch: Partial<T>): Promise<{ affected: number }>`

Update a subset of properties on one or more entities (pass a comma-separated list of IDs to update multiple rows).

### `delete(id: number | string): Promise<null>`

Delete one or more entities (pass a comma-separated list of IDs to delete multiple rows).
