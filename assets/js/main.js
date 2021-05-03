const API_KEY = "a16cb7d329dca1d63027fe78612143ab";

const storedCityData = () => {
  const cities = JSON.parse(localStorage.getItem(`recentCities`) || "[]");

  const cityName = $(`#form1`).val();

  cities.push(cityName);

  if (cities.length < 6) {
    localStorage.setItem(`recentCities`, JSON.stringify(cities));
  } else {
    cities.shift();
    localStorage.setItem(`recentCities`, JSON.stringify(cities));
  }
};

const handleRecentSearch = (event) => {
  const target = $(event.target);

  if (target.is("li")) {
    const cityName = target.data("city");
    fetchAllWeatherData(cityName);
  }
};

const renderRecentCities = () => {
  const cities = JSON.parse(localStorage.getItem(`recentCities`) || "[]");

  const ul = $("<ul>").addClass("list-group recentCities");

  const appendCity = (city) => {
    ul.append(
      `<li class="list-group-item storedCities" aria-current="true" data-city="${city}">
      ${city}
      </li>`
    );
  };

  cities.forEach(appendCity);

  $(".searched-cities").empty().append(ul);

  ul.on("click", handleRecentSearch);
};

const renderCurrentWeather = (currentWeather) => {
  const uvi = currentWeather.uvi;

  $("#renderedCityName").replaceWith(
    `<h3 id="renderedCityName">${currentWeather.name} - ${currentWeather.date}<span><img src="${currentWeather.iconURL}"/></span></h3>`
  );
  $("#iconTitle").attr("src", `${currentWeather.iconURL}`);
  $("#temp").text(`Temperature: ${currentWeather.temperature}°C`);
  $("#humidity").text(`Humidity: ${currentWeather.humidity}%`);
  $("#windSpeed").text(`Wind Speed: ${currentWeather.windSpeed} mph`);
  $("#uvIndex").text(`UV Index: ${uvi}`);

  if (uvi >= 8) {
    $("#uvIndex").addClass("bg-danger");
  } else if (uvi >= 6) {
    $("#uvIndex").addClass("bg-warning");
  } else if (uvi >= 3) {
    $("#uvIndex").addClass("bg-primary");
  } else if (uvi >= 0) {
    $("#uvIndex").addClass("bg-success");
  }
};

const constructFiveDay = (forecast) => {
  const renderForecastCard = (card) => {
    $("#fiveDayForecastCards").append(`
      <div class="fiveDayConstruction">
        <div class="card forecastDayCard" style="width: 15rem">
          <img
            src="https://openweathermap.org/img/wn/${
              card.weather[0].icon
            }@2x.png"
            class="card-img-top weatherImage mx-auto"
          />
          <div class="card-body">
            <h5 class="card-title">${new Date(
              card.dt * 1000
            ).toLocaleDateString("en-gb")}</h5>
            <p class="card-text">
              Temperature: ${card.temp.day}°C
            </p>
            <p class="card-text">
              Humidity: ${card.humidity}%
            </p>
          </div>
        </div>
      </div>
    `);
  };

  forecast.forEach(renderForecastCard);
};

const fetchAllWeatherData = async (cityName) => {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
  const weatherApiResponse = await fetch(weatherApiUrl);
  const weatherApiData = await weatherApiResponse.json();

  const oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&exclude=hourly,minutely&appid=${API_KEY}&units=metric`;
  const oneCallResponse = await fetch(oneCallApiUrl);
  const oneCallData = await oneCallResponse.json();

  const currentData = {
    name: weatherApiData.name,
    date: new Date(weatherApiData.dt * 1000).toLocaleDateString("en-gb"),
    iconURL: `https://openweathermap.org/img/wn/${weatherApiData.weather[0].icon}@2x.png`,
    temperature: weatherApiData.main.temp,
    humidity: weatherApiData.main.humidity,
    windSpeed: weatherApiData.wind.speed,
    uvi: oneCallData.current.uvi,
  };

  renderCurrentWeather(currentData);
  constructFiveDay(oneCallData.daily);
};

const onSubmit = (event) => {
  event.preventDefault();

  const cityName = $(`#form1`).val();

  fetchAllWeatherData(cityName);

  $(".fiveDayConstruction").remove();

  storedCityData();

  renderRecentCities();
};

const onReady = () => {
  renderRecentCities();

  $("#renderedCityName").append(`<h3>Waiting for city...</h3>`);
};

$("#search-form").submit(onSubmit);
$(document).ready(onReady);
