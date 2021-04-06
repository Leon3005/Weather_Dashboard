const API_KEY = "a16cb7d329dca1d63027fe78612143ab";
let cityName = $(`#form1`).val();
const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

const getCurrentData = (oneApiData) => {
  // from object extract the data points you need for the return data
  return {
    name: "",
    date: "",
    iconURL: "",
    temperature: "",
    humidity: "",
    windSpeed: "",
    // uvIndex: 0,
  };
};

// const fetchAllWeatherData = (requestedCityName) => {
//   // construct URL for http://api.openweathermap.org/data/2.5/weather?q={CITY_NAME}&appid={API_KEY} and store in variable called as weatherApiUrl
//   let cityName = $(`#form1`).val();
//   const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
//   const functionForJSON = (responseObject) => {
//     // unless you have some logic here do that before you return
//     return responseObject.json();
//   };

//   const functionForApplication = (dataFromServer) => {
//     let lat = dataFromServer.coord;
//     console.log(lat);
//   };

//   fetch(weatherApiUrl)
//     .then(functionForJSON)
//     .then(functionForApplication)
//     .catch(functionToHandleError);
// };

async function fetchAllWeatherData() {
  const response = await fetch(weatherApiUrl);
  const data = await response.json();
  console.log(data);
  const requestedData = {
    name: data.name,
    date: (data.dt).toISOString(),
    iconURL: ,
    temperature: "",
    humidity: "",
    windSpeed: "",
  };
  console.log(requestedData);
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
  let cityName = $(`#form1`).val();
  console.log(cityName);
  fetchAllWeatherData();
  // get city name from the list item that was clicked and store in variable called cityName
  // fetchAllWeatherData(cityName)
};

// Run onClick function when button is clicked
$("#searchButton").click(onClick);
