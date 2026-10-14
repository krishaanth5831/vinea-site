@AGENTS.md

## Working rules

- `main` deploys straight to www.getvinea.nl. Work goes on `dev` (or a branch
  off it) and reaches `main` by pull request.
- Agents may open pull requests when asked, but never merge them. The owner
  merges every PR.
- Copy rules (no digits outside `data-numbers`, prose only in
  `src/content/`) are in README.md; run `npm run audit:copy` after a build.
