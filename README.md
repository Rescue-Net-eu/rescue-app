# 🆘 Rescue-Net

**[rescue-net.eu](https://rescue-net.eu)** is an open-source platform designed to coordinate and mobilize volunteers across Europe in real-time emergency situations. Inspired by similar localized initiatives, the project aims to empower communities to respond swiftly and effectively to crises.

---

## 🚀 Key Features

- **Real-Time Alerts**: Instantly notify nearby volunteers of emergencies requiring immediate assistance.

- **Mission Tracking**: Monitor ongoing interventions with live updates, ensuring transparency and efficiency.

- **Volunteer Network**: Build and manage a robust database of trained individuals ready to assist when needed.

- **Authority Integration**: Seamlessly collaborate with local and national authorities through interoperable systems.

- **GDPR Compliance**: Prioritize user privacy and data protection in line with European regulations.

---

## 🧱 Modular & Scalable Architecture

Built with scalability in mind, **rescue-net.eu** employs a modular design that allows for easy integration of new features and adaptation to various regional requirements. This ensures the platform can evolve alongside the changing needs of emergency response across different European contexts.

---

## 🤝 Contributing

We welcome contributions from developers, designers, emergency response professionals, and anyone passionate about community-driven crisis management. To get started:

1. **Fork the repository**.

2. **Create a new branch** for your feature or fix.

3. **Submit a pull request** with a clear description of your changes.

For detailed guidelines, please refer to our [CONTRIBUTING.md](CONTRIBUTING.md).

## 🌐 Frontend

A simple static frontend is provided in the `frontend/` directory. It allows basic user registration, mission creation and listing nearby missions through the REST API.

To use the frontend during development, start the backend with Docker Compose and serve the static files using a simple HTTP server:

```bash
cd backend
docker-compose up
```

In another terminal, run:

```bash
cd frontend
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
