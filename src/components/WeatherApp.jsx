

import React, { useState, useEffect } from 'react';
import './WeatherApp.css';
import search_icon from "./Assets/search.png";
import clear_icon from "./Assets/clear.png";
import wind_icon from "./Assets/wind.png";
import humidity_icon from "./Assets/humidity.png";
import mintemp_icon from "./Assets/mintemp.png";
import maxtemp_icon from "./Assets/maxtemp.png";
import cloud_icon from "./Assets/cloud.png";
import drizzle_icon from "./Assets/drizzle.png";
import rain_icon from "./Assets/rain.png";
import snow_icon from "./Assets/snow.png";
import loadingGif from "./Assets/error.gif"; 

const WeatherApp = () => {

    const api_key = "ee362f683e7ad444beb8ba67d28b1b8a";
    const [weatherIcon, setWeatherIcon] = useState(clear_icon);
    const [location, setLocation] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [humidity, setHumidity] = useState('');
    const [windSpeed, setWindSpeed] = useState('');
    const [minTemp, setMinTemp] = useState('');
    const [maxTemp, setMaxTemp] = useState('');
    const [temperature, setTemperature] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user's location when the component mounts
        fetchUserLocation();
    }, []);

    const fetchUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherDataByCoordinates(latitude, longitude);
            }, (error) => {
                console.error(error);
                setError("Unable to fetch your location. Please try again.");
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
            setError("Geolocation is not supported by your browser.");
        }
    }

    const fetchWeatherDataByCoordinates = async (latitude, longitude) => {
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`;
            let response = await fetch(url);

            if (!response.ok) {
                throw new Error('Unable to fetch weather data. Please try again.');
            }

            let data = await response.json();
            updateWeatherData(data);
        } catch (error) {
            console.error(error);
            setError("Unable to fetch weather data. Please try again.");
        }
    }

    const fetchWeatherDataByCity = async (city) => {
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
            let response = await fetch(url);

            if (!response.ok) {
                throw new Error('Unable to fetch weather data. Please check the city name and try again.');
            }

            let data = await response.json();
            const { lat, lon } = data.coord;

            await fetchWeatherDataByCoordinates(lat, lon);

        } catch (error) {
            console.error(error);
            setError(<div className="error-message"><img className="gif" src={loadingGif} alt="Loading GIF" /></div>);
            
            setTimeout(() => {
                setError(null);
            }, 5000);
        }
    }
    


    const updateWeatherData = (data) => {
        try {
            setWeatherIcon(getWeatherIcon(data.weather[0].icon));
            setLocation(data.name);
            setDateTime(getFormattedDateTime(data.dt, data.timezone));
            setHumidity(data.main.humidity + "%");
            setWindSpeed(data.wind.speed + " km/h");
            setMinTemp(data.main.temp_min + "°C");
            setMaxTemp(data.main.temp_max + "°C");
            setTemperature(data.main.temp + "°C");
            setWeatherDescription(data.weather[0].main); 
            setError(null);
        } catch (error) {
            console.error(error);
            setError("Error processing weather data. Please try again.");
        }
    }

    const [weatherDescription, setWeatherDescription] = useState('');

    const getWeatherIcon = (weatherCode) => {
        switch (weatherCode) {
            case "01d":
            case "01n":
                return clear_icon;
            case "02d":
            case "02n":
            case "03d":
            case "03n":
            case "04d":
            case "04n":
                return cloud_icon;
            case "09d":
            case "09n":
            case "10d":
            case "10n":
                return rain_icon;
            case "13d":
            case "13n":
                return snow_icon;
            default:
                return clear_icon;
        }
    }

    
    const getFormattedDateTime = (timestamp, timezone) => {
        try {
            const localTime = new Date((timestamp + timezone) * 1000);
    
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'UTC',
            };
    
            const formattedDateTime = localTime.toLocaleDateString('en-US', options);
            return formattedDateTime;
        } catch (error) {
            console.error(error);
            setError("Error processing date and time. Please try again.");
            return "";
        }
    };
    

    const handleSearch = async () => {
        const searchInput = document.getElementsByClassName("CityInput")[0].value;
        if (searchInput !== "") {
            await fetchWeatherDataByCity(searchInput);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <div className='container'>
            <div className='top-bar'>
                <input
                    type='text'
                    className='CityInput'
                    placeholder='Search for City'
                    onKeyDown={handleKeyDown}
                />
                <div className='search_icon' onClick={handleSearch}>
                    <img src={search_icon} alt="Search Icon"></img>
                </div>
            </div>
            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                <>
                    <div className='weather_location'>
                        <h1>{location}</h1>
                    </div>
                    <div className='date_time'>
                        <h3>{dateTime}</h3>
                    </div>
                
                    <div className='weather_temp'>
                        <div className='temp_desc'>
                            <h1 className='weather_temp'>{temperature}</h1>
                            <h2>{weatherDescription}</h2>
                        </div>
                        <img className='clear_icon' src={weatherIcon} alt="Weather Icon"></img>
                    </div>

                    <div className='features'>
                        <div className='element'>
                            <img className='humidity_icon' src={humidity_icon} alt="Humidity Icon"></img>
                            <div className='data'>
                                <div className='humidity_percentage'>{humidity}</div>
                                <div className='text'>Humidity</div>
                            </div>
                        </div>
                        <div className='element'>
                            <img className='wind_icon' src={wind_icon} alt="Wind Icon"></img>
                            <div className='data'>
                                <div className='wind_speed'>{windSpeed}</div>
                                <div className='text'>Wind Speed</div>
                            </div>
                        </div>
                        <div className='element'>
                            <img className='mintemp_icon' src={mintemp_icon} alt="Min Temp Icon"></img>
                            <div className='data'>
                                <div className='min_temp'>{minTemp}</div>
                                <div className='text'>Min Temp</div>
                            </div>
                        </div>
                        <div className='element'>
                            <img className='maxtemp_icon' src={maxtemp_icon} alt="Max Temp Icon"></img>
                            <div className='data'>
                                <div className='max_temp'>{maxTemp}</div>
                                <div className='text'>Max Temp</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default WeatherApp;
