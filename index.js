const axios = require('axios');

// Get city name from command line arguments
const city = process.argv[2];

// Validate that city argument was provided
if (!city) {
  console.error('Error: Please provide a city name as an argument.');
  console.error('Usage: node index.js "CityName"');
  process.exit(1);
}

/**
 * Fetches current weather data for a given city
 * Uses Open-Meteo API (free, no authentication required)
 * 
 * @param {string} cityName - The name of the city to fetch weather for
 * @throws {Error} If city is not found or API request fails
 */
async function fetchWeather(cityName) {
  try {
    // Step 1: Get coordinates using geocoding API
    // Convert city name to latitude/longitude
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geoResponse = await axios.get(geoUrl);

    // Validate that city was found
    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      console.error(`Error: City "${cityName}" not found.`);
      process.exit(1);
    }

    const { latitude, longitude, name, country } = geoResponse.data.results[0];

    // Step 2: Get weather data using coordinates
    // Fetch current temperature, weather condition, and wind speed
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`;
    const weatherResponse = await axios.get(weatherUrl);
    const current = weatherResponse.data.current;

    // Step 3: Map weather codes to human-readable descriptions
    // WMO Weather interpretation codes
    // Reference: https://www.open-meteo.com/en/docs
    const weatherDescriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };

    const weatherDescription = weatherDescriptions[current.weather_code] || 'Unknown';
    const temperature = current.temperature_2m;
    const windSpeed = current.wind_speed_10m;

    // Display weather information to user
    console.log(`\nWeather in ${name}, ${country}: ${temperature}°C, ${weatherDescription}\n`);

  } catch (error) {
    // Handle specific error cases
    if (error.response && error.response.status === 404) {
      console.error(`Error: City "${cityName}" not found.`);
    } else if (error.message === 'Network Error') {
      console.error('Error: Failed to connect to the weather service. Please check your internet connection.');
    } else {
      console.error(`Error: Unable to fetch weather data. ${error.message}`);
    }
    process.exit(1);
  }
}

// Execute the weather fetch
fetchWeather(city);
