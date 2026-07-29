"""Golden reference solution for <task-name>.

Rules this file must satisfy:

* It must DERIVE the answer through the same reasoning an expert would do
  -- read the seeded state, analyze it, compute results. It must never
  hardcode or echo the final answer, because reviewers check for exactly
  that.
* Every artifact it writes goes to an ABSOLUTE /app path.
* Running it from the seeded image state must make the full pytest suite
  pass (harbor run -p . --agent oracle => reward 1.0).
"""

from pathlib import Path

APP = Path("/app")


def main() -> None:
    # 1. Read the seeded inputs the agent is given.
    # 2. Perform the real analysis/repair/computation, step by step.
    # 3. Write every required artifact to its absolute /app path.
    raise NotImplementedError("implement the reference solution")


if __name__ == "__main__":
    main()
