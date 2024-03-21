import hotBg from "./images/hot.jpg";
import coldBg from "./images/cold.jpg"
import Descriptions from "./Components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);
  const [loading, setLoading] = useState(false); // State variable to track loading state

  useEffect(() => {
    if (city) fetchWeatherData();
  }, [units]);

  const fetchWeatherData = async () => {
    if (!city) {
      toast.warning('Please enter city name');
      return;
    }
    
    setLoading(true); // Set loading to true when fetching data

    try {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      // dynamic bg
      const threshold = units === "metric" ? 20 : 60;
      if (data.temp <= threshold) setBg(coldBg);
      else setBg(hotBg);
    } catch (error) {
      console.log(error.message);
      toast.error('Enter a valid city');
    } finally {
      setLoading(false); // Set loading to false when data fetching is done
    }
  };

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const handleFetchWeatherClick = () => {
    fetchWeatherData();
  };

  return (
    <>
      <div className="app" style={{ backgroundImage: `url(${bg})` }}>
        <div className="overlay">
          <div className="container">
            <div className="section section__inputs">
              <input
                onChange={(e) => { setCity(e.target.value) }}
                type="text"
                name="city"
                value={city}
                placeholder="Enter City..."
              />
              <button onClick={handleFetchWeatherClick}>{loading ? 'Loading...' : 'Search'}</button>
              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>

            <div className="section section__temperature">
              {weather && (
                <div className="icon">
                  <h3>{`${weather.name}, ${weather.country}`}</h3>
                  <img src={weather.iconURL} alt="weatherIcon" />
                  <h3>{weather.description}</h3>
                </div>
              )}
              <div className="temperature">
                {weather && (
                  <h1>{`${weather.temp.toFixed()} °${units === "metric" ? "C" : "F"}`}</h1>
                )}
              </div>
            </div>

            {/* bottom description */}
            {weather && <Descriptions weather={weather} units={units} />}
          </div>
        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;
