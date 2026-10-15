# 🌡️ Thermo — Temperature Converter

A modern, responsive temperature converter built using **HTML, CSS, and JavaScript**. Thermo makes it easy to convert temperatures between Celsius, Fahrenheit, and Kelvin through a clean, interactive interface.

## ✨ Features

- **Instant Conversion:** Get converted values while typing.
- **Three Temperature Scales:** Convert between Celsius (°C), Fahrenheit (°F), and Kelvin (K).
- **Input Validation:** Handles invalid inputs and prevents temperatures below absolute zero.
- **Step-by-Step Formulas:** View the mathematical calculations behind each conversion.
- **Quick Presets:** Try common temperatures, including freezing point, body temperature, boiling point, and absolute zero.
- **Conversion History:** Access your five most recent conversions.
- **Copy Results:** Copy all converted values with one click.
- **Light & Dark Themes:** Switch between two visually appealing themes.
- **Responsive Design:** Works on desktop, tablet, and mobile screens.
- **Temperature Gauge:** View a descriptive temperature label and visual indicator.
- **Keyboard Support:** Use Enter to convert and Escape to clear the input.

## 🛠️ Technologies Used

- **HTML5** — Page structure and accessible form elements.
- **CSS3** — Responsive layout, styling, animations, and themes.
- **JavaScript (ES6+)** — Conversion logic, validation, history, and interactive features.
- **LocalStorage** — Saves theme preference and recent conversion history in the browser.

## 📁 Project Structure

```text
thermo-temperature-converter/
│
├── index.html      # Main application structure
├── style.css       # Styling and responsive design
├── script.js       # Conversion logic and interactions
└── README.md       # Project documentation
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/thermo-temperature-converter.git
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Open the project folder

```bash
cd thermo-temperature-converter
```

### 3. Run the application

Open `index.html` in your web browser.

Alternatively, open the project in Visual Studio Code and run it using the **Live Server** extension.

No package installation or backend server is required.

## 🧮 Temperature Conversion Formulas

Thermo uses standard mathematical formulas to convert temperatures.

| Conversion | Formula |
|---|---|
| Celsius to Fahrenheit | °F = (°C × 9/5) + 32 |
| Celsius to Kelvin | K = °C + 273.15 |
| Fahrenheit to Celsius | °C = (°F − 32) × 5/9 |
| Fahrenheit to Kelvin | K = (°F − 32) × 5/9 + 273.15 |
| Kelvin to Celsius | °C = K − 273.15 |
| Kelvin to Fahrenheit | °F = (K − 273.15) × 9/5 + 32 |

## 📌 Example

**Input:** 25 °C

**Converted results:**

- Celsius: 25 °C
- Fahrenheit: 77 °F
- Kelvin: 298.15 K

## 🎨 User Interface

Thermo features a modern interface with a gradient background, organized conversion cards, interactive controls, and a responsive layout. Users can switch themes, select quick examples, inspect formulas, and revisit recent conversions.

## 🔒 Data and Privacy

Conversion history and theme preferences are stored locally in the browser using LocalStorage. The application does not require a backend or send conversion data to a remote server.

## 🌱 Future Improvements

- Add temperature conversion between Rankine and Réaumur.
- Support multiple languages.
- Add conversion history export.
- Add automated unit tests.
- Deploy the application using GitHub Pages.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## 📄 License

This project is open source. You may use, modify, and distribute it under the terms of the license you choose. Add a `LICENSE` file to the repository to specify those terms.

## 👨‍💻 Author

**Abhishek Patel**

GitHub: https://github.com/a-bhi2244

---

⭐ If you find this project useful, consider giving the repository a star!

**Built with ❤️ using HTML, CSS, and JavaScript.**