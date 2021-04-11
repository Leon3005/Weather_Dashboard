const API_KEY = "a16cb7d329dca1d63027fe78612143ab";
let requestedData;
let oneCallRequestedData;
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
};

const renderRecentCities = () => {
  $(".searched-cities").empty();
  const ul = $("<ul>").addClass("list-group recentCities");
  for (let i = 0; i < storedCity.length; i++) {
    // const recentCitiesLi = $("#recentCities li");
    // $("#recentCities").removeChildren(recentCitiesLi);
    ul.append(`
<li class="list-group-item storedCities" aria-current="true">
${storedCity[i]}
</li>
`);
  }
  $(".searched-cities").append(ul);
};

const renderCurrentWeather = (currentWeather, currentOneCall) => {
  let cityName = $(`#form1`).val();
  $("#renderedCityName").replaceWith(
    `<h3 id="renderedCityName">${currentWeather.name} - ${currentWeather.date}<span><img src="${currentWeather.iconURL}"/></span></h3>`
  );
  $("#iconTitle").attr("src", `${currentWeather.iconURL}`);
  $("#temp").text(`Temperature: ${currentWeather.temperature}°C`);
  $("#humidity").text(`Humidity: ${currentWeather.humidity}%`);
  $("#windSpeed").text(`Wind Speed: ${currentWeather.windSpeed} mph`);
  $("#uvIndex").text(`UV Index: ${currentOneCall.uvi}`);
  if (currentOneCall.uvi >= 8) {
    $("#uvIndex").addClass("bg-danger");
  } else if (currentOneCall.uvi >= 6) {
    $("#uvIndex").addClass("bg-warning");
  } else if (currentOneCall.uvi >= 3) {
    $("#uvIndex").addClass("bg-primary");
  } else if (currentOneCall.uvi >= 0) {
    $("#uvIndex").addClass("bg-success");
  }
  console.log(currentOneCall.uvi);
};

const constructFiveDay = (currentOneCall) => {
  for (let index = 1; index < 6; index++) {
    $("#fiveDayForecastCards")
      .append(`<div class="fiveDayConstruction"><div class="card forecastDayCard" style="width: 15rem">
    <img
      src="http://openweathermap.org/img/wn/${
        currentOneCall.daily[index].weather[0].icon
      }@2x.png"
      class="card-img-top weatherImage mx-auto"
    />
    <div class="card-body">
      <h5 class="card-title">${new Date(
        currentOneCall.daily[index].dt * 1000
      ).toLocaleDateString("en-gb")}</h5>
      <p class="card-text">
        Temperature: ${currentOneCall.daily[index].temp.day}°C
      </p>
      <p class="card-text">
      Humidity: ${currentOneCall.daily[index].humidity}%
    </p>
    </div>
  </div></div>`);
  }
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
    lon: data.coord.lon,
    lat: data.coord.lat,
  };
  const oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${requestedData.lat}&lon=${requestedData.lon}&exclude=hourly,minutely&appid=${API_KEY}&units=metric`;
  const oneCallResponse = await fetch(oneCallApiUrl);
  const oneCallData = await oneCallResponse.json();
  oneCallRequestedData = {
    uvi: oneCallData.current.uvi,
    daily: oneCallData.daily,
  };
  renderCurrentWeather(requestedData, oneCallRequestedData);
  constructFiveDay(oneCallRequestedData);
}

const onClick = () => {
  fetchAllWeatherData();
  let cityName = $(`#form1`).val();
  $(".fiveDayConstruction").remove();
  storedCityData();
  renderRecentCities();
};

// Run onClick function when button is clicked
$("#searchButton").click(onClick);
