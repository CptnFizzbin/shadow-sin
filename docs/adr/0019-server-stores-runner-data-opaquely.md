# The server stores `RunnerData` as an opaque document

`api.shadowsin.app` stores each cloud Runner's `RunnerData` as the JSON the client sent. It reads
only the few fields it needs (owner Account, revision, name, SIN Version) and doesn't model or
validate the rest in C#. The client already owns the schema and its Migrations, and the server is
optional: the app has to work fully without it. Modeling `RunnerData` in C# would mean a second
copy of a large, fast-changing schema and a second migration system that must stay in lockstep
with the client's. No server feature needs that today, since storage, the GM's read-only view, and
the revision check all work on an opaque document.

## Consequences

- The server never runs Migrations. A Runner fetched from the server, including by a GM viewing a
  Table, is migrated client-side after loading, like one from any other `StorageSource`.
- The server can't reject a malformed `RunnerData`. Validation stays wherever the client does it
  today.
