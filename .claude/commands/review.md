Run a full quality review on the current changes.

## Steps

1. Run `git diff --name-only` to identify changed files
2. Run the **code-reviewer** subagent on the changed source files
3. Run the **design-reviewer** subagent on any changed component files
4. Run the **test-writer** subagent to check test coverage for changes
5. Run `bun run build` to verify the build passes
6. Run `bun run test:run` to verify all unit tests pass
7. Run `bun run test:e2e` to verify all E2E tests pass
8. Summarize all findings and whether the changes are ready to merge
