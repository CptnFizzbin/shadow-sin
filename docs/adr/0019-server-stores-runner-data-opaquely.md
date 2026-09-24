# The server stores `RunnerData` as an opaque document with a fixed envelope

`api.shadowsin.app` stores each cloud Runner's `RunnerData` as the JSON the client sent. It
understands only a small, fixed envelope of top-level fields, which both sides agree on: `id` (a
client-generated UUIDv7), `name`, `_meta_.sinVersion`, and a server-owned `_server_` object. It
doesn't model or validate anything else in C#. The client already owns the schema and its
Migrations, and the server is optional: the app has to work fully without it. Modeling
`RunnerData` in C# would mean a second copy of a large, fast-changing schema and a second migration
system that must stay in lockstep with the client's.

The envelope lives in `RunnerData` itself rather than wrapping it, so today's format stays valid
and existing and local-only Runners need no conversion. Splitting storage metadata out of
`RunnerData` is left for a future change.

## The envelope

- `id`, `name`, `_meta_.sinVersion` — existing fields, set by the client.
- `_server_` — optional. Only the server writes it, and Runners outside cloud storage don't have
  it. In phase 1 it holds only `updatedAt`, an ISO 8601 timestamp string with millisecond
  precision and an offset, issued in America/Toronto time, e.g. `"2026-09-23T23:08:08.123-04:00"`
  (see the timestamp rules below). The server uses it for the stale-push check:
  - Only the server assigns it; a client clock never sets it.
  - A push is accepted only if its `_server_.updatedAt` exactly matches the stored value,
    compared as the same ISO string the server issued.
  - It strictly increases per Runner, compared as instants rather than strings: the offset
    changes at daylight-saving transitions, so later times don't always sort later as text. Two
    pushes in the same millisecond get distinct values.
- The owning Account is never stored in the document. The session identifies it, and the GM's
  Table view receives owners alongside the list of Runners.

## Timestamps

No timestamp, in the database, in `RunnerData`, or in server logs, is ever stored without time
zone information. Timestamps the server issues use America/Toronto time with the offset written
out (`-05:00` or `-04:00`) and no zone name. That's for debugging: server logs, the database, and
`_server_` fields read in the maintainer's local time. Timestamps the client writes stay as they
are today, UTC with a `Z` suffix, which also carries zone information. Timestamps are always
compared as instants, never as strings.

## Consequences

- The server never runs Migrations. A Runner fetched from the server, including by a GM viewing a
  Table, is migrated client-side after loading, like one from any other `StorageSource`.
- The server can't reject a malformed `RunnerData` beyond its envelope. Validation of the rest
  stays wherever the client does it today.
- Adding `_server_` to `RunnerData` is a schema change, so it comes with a client Migration.
