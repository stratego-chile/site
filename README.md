# Stratego Site

This project is licensed under the [MIT License](https://github.com/stratego-chile/site/blob/main/LICENSE)

## Motivation

This repository contains the source code for the Stratego presentation and documentation site.

We are compromised with the transparency of the software and we want to let you know what is exactly being executed in **your browser** at the time you access to this application.

## Contributions

If you want to make a contribution, let us know by adding a [new issue](https://github.com/stratego-chile/site/issues/new) to this repository.

There are no many reasons to add things to this repository in particular, specially if you are not directly responsible of the content on it, but we are aware that this is great way to communicate ideas and/or report application errors.

:warning: If you want to report a security vulnerability, please [send us an email](mailto:security@stratego.cl). Do **NOT** create issues for security vulnerabilities reports.

## Getting Started

First of all, to start developing on this project, you need to be aware that this project uses [PNPM](https://pnpm.io) as package manager. To get this approach, we highly recommend the use of the [Volta](https://volta.sh/) tool manager.

Once you have the tools indicated above, to start the development server just run:

```bash
pnpm dev
# or, for a local server using TLS encryption:
pnpm dev:ssl
```

The application will be started in localhost:3000. Depending on your development server start command, the app will be accessible under the HTTP or HTTPS protocol.

## About technologies

This project use TypeScript and SASS, powered by the [Next.js framework](https://nextjs.org/).
