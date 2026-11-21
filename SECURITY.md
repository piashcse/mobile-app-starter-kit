# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 2.x     | ✅        |
| 1.x     | ❌        |

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Report vulnerabilities privately through
[GitHub Security Advisories](https://github.com/piashcse/mobile-app-starter-kit/security/advisories/new)
or email the maintainer listed in `package.json`.

Include:

- The CLI version (`npx mobile-app-starter-kit --version`)
- The command you ran
- A minimal reproduction
- The impact you believe it has

We aim to acknowledge reports within 3 business days and to publish a fix as
soon as practical.

## Scope

The CLI writes files and executes framework toolchains. Reports involving
command injection, path traversal, unsafe template rendering, or leaked
secrets/absolute paths in generated projects are especially relevant.
