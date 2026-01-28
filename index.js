const axios = require('axios');

const city = process.argv[2];

if (!city) {
  console.error('Error: Please provide a city name as an argument.');
  console.error('Usage: node index.js "CityName"');
  process.exit(1);
}

async function fetchWeather(cityName) {
  try {
    // Get coordinates using geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geoResponse = await axios.get(geoUrl);

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      console.error(`Error: City "${cityName}" not found.`);
      process.exit(1);
    }

    const { latitude, longitude, name, country } = geoResponse.data.results[0];

    // Get weather data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`;
    const weatherResponse = await axios.get(weatherUrl);
    const current = weatherResponse.data.current;

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

    console.log(`\nWeather in ${name}, ${country}: ${temperature}°C, ${weatherDescription}\n`);

  } catch (error) {
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

fetchWeather(city);
