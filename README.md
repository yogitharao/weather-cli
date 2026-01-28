# Weather CLI

A simple command-line application that fetches and displays current weather information for any city.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

```bash
git clone https://github.com/yogitharao/weather-cli.git
cd weather-cli
npm install
```

## Usage

Run the application with a city name as an argument:

```bash
node index.js "London"
```

### Examples

```bash
node index.js "New York"
node index.js "Tokyo"
node index.js "Paris"
```

## Output

```
Weather in London, United Kingdom: 5.8°C, Partly cloudy
```

## Features

- ✅ Fetches real-time weather data using Open-Meteo API
- ✅ No API key required (free to use)
- ✅ Works with any city worldwide
- ✅ Displays current temperature, weather condition, and wind speed
- ✅ Comprehensive error handling for invalid cities and network issues
- ✅ Clear, user-friendly console output
- ✅ Full weather code descriptions (76+ conditions)

## Technical Details

### Architecture

The application uses an asynchronous workflow:

1. **Geocoding**: Uses Open-Meteo Geocoding API to convert city name to coordinates
2. **Weather Fetch**: Uses coordinates to fetch current weather data from Open-Meteo Forecast API
3. **Data Parsing**: Converts weather codes to human-readable descriptions

### How It Works

```javascript
// 1. User provides city name via command line
node index.js "London"

// 2. App geocodes city name to get coordinates
// GET https://geocoding-api.open-meteo.com/v1/search?name=London...
// Response: { latitude: 51.5085, longitude: -0.1257, name: "London", country: "United Kingdom" }

// 3. App fetches weather using coordinates
// GET https://api.open-meteo.com/v1/forecast?latitude=51.5085&longitude=-0.1257...
// Response: { temperature_2m: 5.7, weather_code: 2, wind_speed_10m: 12.4 }

// 4. App converts weather code to description and displays result
// Output: "Weather in London, United Kingdom: 5.7°C, Partly cloudy"
```

### Error Handling

The app gracefully handles:

- Missing city argument
- City not found errors
- Network connection failures
- API response errors

### API Used

- **Service**: Open-Meteo (https://open-meteo.com)
- **Geocoding API**: Free, no authentication required
- **Weather API**: Free, no authentication required
- **Rate Limits**: No rate limiting for reasonable use

## Project Structure

```
weather-cli/
├── index.js          # Main application file
├── package.json      # Project dependencies and metadata
├── README.md         # This file
├── .gitignore        # Git ignore rules
└── package-lock.json # Dependency lock file
```

## License

ISC
