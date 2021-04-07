const API_KEY = "a16cb7d329dca1d63027fe78612143ab";
let requestedData;

const storedCityData = () => {
  let cityName = $(`#form1`).val();
  let storedCity = JSON.parse(localStorage.getItem(`${cityName}`) || "[]");
  // for (let i = 0; i < 5; i++) {
  const pushToArray = () => {
    let cityName = $(`#form1`).val();
    storedCity.push(cityName);
  };
  const saveCity = () => {
    localStorage.setItem(`recentCity`, storedCity);
  };
  pushToArray();
  saveCity();
  // }
};

const renderCurrentWeather = (currentWeather) => {
  let cityName = $(`#form1`).val();
  console.log(cityName);
  // $("#titleCity").text("");
  $("#titleCity").text(`${currentWeather.name} - ${currentWeather.date}`);
  // <span><img id="iconTitle" class="titleImage" /></span>
  $("#iconTitle").attr("src", `${currentWeather.iconURL}`);
  $("#temp").text(`Temperature: ${currentWeather.temperature}°C`);
  $("#humidity").text(`Humidity: ${currentWeather.humidity}%`);
  $("#windSpeed").text(`Wind Speed: ${currentWeather.windSpeed} mph`);
};

async function fetchAllWeatherData() {
  let cityName = $(`#form1`).val();
  const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
  const response = await fetch(weatherApiUrl);
  const data = await response.json();
  let iconCode = data.weather[0].icon;
  const date = new Date(data.dt * 1000).toLocaleDateString("en-gb");
  const icon = await fetch(
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`
  );
  requestedData = {
    name: data.name,
    date: date,
    iconURL: `${icon.url}`,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
  console.log(requestedData);
  renderCurrentWeather(requestedData);
}

// const functionForJSON = (responseObject) => {
//   // unless you have some logic here do that before you return
//   return responseObject.json()
//   }const functionForApplication = (dataFromServer) => {
//   // whatever your application code is goes here
//   }const functionToHandleError = (errorObject) => {
//   // handle your error here according to your application
//   }fetch(myUrl)
//   .then(functionForJSON)
//   .then(functionForApplication)
//   .catch(functionToHandleError)

const onClick = () => {
  fetchAllWeatherData();
  let cityName = $(`#form1`).val();
  storedCityData();
  // get city name from the list item that was clicked and store in variable called cityName
  // fetchAllWeatherData(cityName)
};

// Run onClick function when button is clicked
$("#searchButton").click(onClick);
