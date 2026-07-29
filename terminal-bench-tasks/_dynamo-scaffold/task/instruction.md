<!-- The ONLY file the agent sees at runtime, alongside the seeded /app files.
     It must be self-contained: absolute paths, normative formats, and
     success criteria the agent can check on its own without the tests. -->

# <Task title: the concrete problem, not the technique>

<2-4 sentences of scenario. State the situation and what is wrong or
needed, in the voice of the person who would actually be paid to do this.
Do not hint at the solution method -- the reasoning is the task.>

## What you must produce

1. `/app/<exact-absolute-path>` — <what it is, and what it must contain>.
2. `/app/<exact-absolute-path>` — <second artifact, if any>.

<Every artifact the tests check MUST be named here with an absolute path.
Anything the agent only prints to stdout cannot be scored and must not be
a requirement.>

## Output format (normative)

<Give the EXACT schema, not just an example. Field names, types, ordering,
numeric formatting/precision, encoding. If you show a sample, say
explicitly that it is normative.>

```json
{
  "REPLACE_ME_key_a": "<type and meaning>",
  "REPLACE_ME_key_b": "<type and meaning>"
}
```

Numbers are formatted with `<exact precision rule>`. Keys appear in the
order listed above.

## Required behavior

- <Behavior 1, stated so it is checkable: exact command, exact output.>
- <Error contract: on <condition>, print `<exact message>` to stderr and
  exit with code `<n>`.>
- <Exit codes for the success path.>

## Success criteria you can verify yourself

Running the following must succeed:

```bash
<exact command the agent can run to self-check>
```

## Constraints

- Do not modify `<protected paths>`. These are verified byte-for-byte.
- <Which files ARE fair game to change.>
- The environment has no network access; everything required is installed.
- <Any resource/approach constraints that are genuinely enforced by tests.>
