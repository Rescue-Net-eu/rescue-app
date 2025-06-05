# Contributing to Rescue-Net

We welcome contributions that help improve the Rescue-Net platform. Please follow these guidelines to ensure a smooth development process.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork and create a new branch for your changes.
3. From the repository root, install all dependencies:
   ```bash
   npm install
   ```
4. Start the API service:
   ```bash
   cd apps/api
   npm run start:dev
   ```
5. In a new terminal, start the web frontend:
   ```bash
   cd apps/web
   npm run dev
   ```
6. Optionally start the React Native app:
   ```bash
   cd apps/mobile
   npm run ios   # or npm run android
   ```

## Coding Guidelines

- Use [Prettier](https://prettier.io/) to format TypeScript and JavaScript code.
- Keep commits focused and include clear commit messages describing the changes.
- When adding new functionality, include comments or documentation where helpful.

## Pull Requests

1. Ensure your branch is up to date with `main`.
2. Open a pull request with a clear description of the problem and how your changes address it.
3. Be ready to respond to any review comments and make updates if requested.

Thank you for helping improve Rescue-Net!
