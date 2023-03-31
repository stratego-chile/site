# Stratego Site

[![CircleCI](https://circleci.com/gh/stratego-chile/site/tree/main.svg?style=svg)](https://circleci.com/gh/stratego-chile/site/tree/main)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/04f20d4c36154742a4d97119f7a88038)](https://app.codacy.com/gh/stratego-chile/site/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

This project is licensed under the [MIT License](https://github.com/stratego-chile/site/blob/main/LICENSE)

## Motivation

This repository contains the source code for the Stratego presentation and documentation site.

We are compromised with the transparency of the software and we want to let you know what is exactly being executed in
**your browser** at the time you access to this application.

## Contributions

If you want to make a contribution, let us know by adding a [new issue](https://github.com/stratego-chile/site/issues/new)
to this repository.

There are no many reasons to add things to this repository in particular, specially if you are not directly responsible
of the content on it, but we are aware that this is great way to communicate ideas and/or report application errors.

:warning: If you want to report a security vulnerability, please [send us an email](mailto:security@stratego.cl) or create a security advisory in the [GitHub Security tab](https://github.com/stratego-chile/site/security/advisories).

**Do NOT create issues for security vulnerabilities reports.**

## Getting Started

### Prerequisites

First of all, you will need to have the [PNPM package manager](https://pnpm.io) installed.

If you don't have PNPM installed, you can try one of the [official installation methods](https://pnpm.io/installation) according to your system.

Alternatively, we [highly recommend](https://docs.volta.sh/guide/#why-volta) the use of the [Volta](https://docs.volta.sh/guide/understanding) tool manager to install PNPM.

If you don't have Volta installed, just follow the [official Volta installation instructions](https://docs.volta.sh/guide/getting-started).

Then, once Volta is installed, you can install PNPM by running:

```bash
volta install pnpm
```

*You can optionally activate the [Volta experimental PNPM support](https://docs.volta.sh/advanced/pnpm)*

### Installing the project dependencies

Just execute:

```bash
pnpm install
```

### Running the development server

Some features use external services which require authentication, to ensure the app is fully working, you will also need to set up the environment variables.
To do this, just copy the `.env.example` file to `.env.local` and fill the variables with the correct values.

To start the development server just run:

```bash
# To start a local server without TLS encryption:
pnpm dev # Some features are not available in this mode

# To start a local server with TLS encryption:
pnpm cert # only once. This will generate the self-signed TLS certificate
pnpm dev:ssl
```

Note this application use a custom server to handle the TLS encryption. This is because Next.js does not support TLS
encryption out of the box.

The application will be started in localhost:3000. Depending on your development server start command, the app will be
accessible under the HTTP or HTTPS protocol.

## Development technologies

This project use *strictly* [TypeScript](https://www.npmjs.com/package/typescript) and [SASS](https://www.npmjs.com/package/sass), powered by the [Next.js framework](https://nextjs.org/).

For further information about the development technologies used in this project, please refer to the [package.json](https://github.com/stratego-chile/site/blob/main/package.json)
