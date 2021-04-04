const myUrl =
  "http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=a16cb7d329dca1d63027fe78612143ab";

const functionForJSON = (responseObject) => {
  // unless you have some logic here do that before you return
  return responseObject.json();
};
const functionForApplication = (dataFromServer) => {
  // whatever your application code is goes here
  console.log(dataFromServer);
};
const functionToHandleError = (errorObject) => {
  // handle your error here according to your application
  console.log(errorObject);
};

fetch(myUrl)
  .then(functionForJSON)
  .then(functionForApplication)
  .catch(functionToHandleError);
