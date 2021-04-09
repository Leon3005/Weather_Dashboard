const API_KEY = "a16cb7d329dca1d63027fe78612143ab";
let requestedData;
let storedCity = JSON.parse(localStorage.getItem(`recentCities`) || "[]");
$(document).ready(function () {
  renderRecentCities();
  $("#renderedCityName").append(`<h3>Waiting for city...</h3>`);
});

const storedCityData = () => {
  let cityName = $(`#form1`).val();
  storedCity.push(cityName);
  if (storedCity.length < 6) {
    localStorage.setItem(`recentCities`, JSON.stringify(storedCity));
  } else {
    storedCity.shift();
    localStorage.setItem(`recentCities`, JSON.stringify(storedCity));
    console.log("full!");
  }
  console.log(storedCity);
};

const renderRecentCities = () => {
  for (let i = 0; i < storedCity.length; i++) {
    $("#recentCities").append(`
<li class="list-group-item" aria-current="true">
${storedCity[i]}
</li>
`);
  }
};

const renderCurrentWeather = (currentWeather) => {
  let cityName = $(`#form1`).val();
  console.log(cityName);
  $("#renderedCityName").replaceWith(
    `<h3 id="renderedCityName">${currentWeather.name} - ${currentWeather.date}<span><img src="${currentWeather.iconURL}"/></span></h3>`
  );
  $("#iconTitle").attr("src", `${currentWeather.iconURL}`);
  $("#temp").text(`Temperature: ${currentWeather.temperature}°C`);
  $("#humidity").text(`Humidity: ${currentWeather.humidity}%`);
  $("#windSpeed").text(`Wind Speed: ${currentWeather.windSpeed} mph`);
  console.log(currentWeather.name);
};

const constructFiveDay = () => {
  for (let index = 0; index < 5; index++) {
    $("#fiveDayForecastCards")
      .append(`<div class="card forecastDayCard" style="width: 15rem">
    <img
      src="./assets/images/sun.png"
      class="card-img-top weatherImage mx-auto"
      alt="..."
    />
    <div class="card-body">
      <h5 class="card-title">Date</h5>
      <p class="card-text">
        Some quick example text to build on the Date and make up the bulk of
        the card's content.
      </p>
    </div>
  </div>`);
  }
};

async function fetchAllWeatherData() {
  let cityName = $(`#form1`).val();
  const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
  const oneCallApiIrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`;
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

const onClick = () => {
  fetchAllWeatherData();
  let cityName = $(`#form1`).val();
  storedCityData();
  constructFiveDay();
};

// Run onClick function when button is clicked
$("#searchButton").click(onClick);
