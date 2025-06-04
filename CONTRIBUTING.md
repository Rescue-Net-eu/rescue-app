# Contributing to Rescue-Net

We welcome contributions that help improve the Rescue-Net platform. Please follow these guidelines to ensure a smooth development process.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork and create a new branch for your changes.
3. Install the backend dependencies using:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Start the backend with Docker Compose:
   ```bash
   cd backend
   docker-compose up
   ```
5. Optionally run the simple frontend server:
   ```bash
   cd ../frontend
   python3 -m http.server 8080
   ```

## Coding Guidelines

- Follow standard [PEP 8](https://www.python.org/dev/peps/pep-0008/) style for Python code.
- Keep commits focused and include clear commit messages describing the changes.
- When adding new functionality, provide docstrings and comments as needed.

## Pull Requests

1. Ensure your branch is up to date with `main`.
2. Open a pull request with a clear description of the problem and how your changes address it.
3. Be ready to respond to any review comments and make updates if requested.

Thank you for helping improve Rescue-Net!
