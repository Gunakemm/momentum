
//Watch//
function showTime(){
    const date = new Date();
    const options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
    const currentTime = date.toLocaleDateString('ru-RU', options);
    let arr = currentTime.split(', ');
    document.querySelector('.time').replaceChildren(arr[1]);
    setTimeout(showTime, 1000);
}
showTime();
function showData(){
    const date = new Date();
    const options = {month: 'long', day: 'numeric', weekday: 'long'};
    const currentDate = date.toLocaleDateString('en-US', options);
    document.querySelector('.date').replaceChildren(currentDate);
    setTimeout(showData, 60000);
}
showData();


//Greeting//
function getTimeOfDay(){
    const date = new Date();
    const hours = date.getHours();
    if(hours >= 0 && hours < 5) return 'night';
    if(hours >= 6 && hours < 12) return 'morning';
    if(hours >= 12 && hours < 18) return 'afternoon';
    return 'evening'
}
function showGreeting(){
    const dayTime = getTimeOfDay();
    const greetingText = `Good ${dayTime}`;
    document.querySelector('.greeting').replaceChildren(greetingText);
}
showGreeting();

const _name = document.querySelector('.name');
function setLocalStorage(){
    localStorage.setItem('_name', _name.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage(){
    if(localStorage.getItem('_name')){
        _name.value = localStorage.getItem('_name');
    }
}
window.addEventListener('load', getLocalStorage);


//Weather widget//
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

async function getWeather(){
    if(!city.value) {
        city.value = 'Minsk';
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=00ff01a303438bd46bbf6089de899381&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Wind speed ${data.wind.speed.toFixed(0)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
}

function setCity(event){
    if(event.code == 'Enter'){
        getWeather();
        
    }
}

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);

//Image slider//
const nextButton = document.querySelector('.slider-next');
const prevButton = document.querySelector('.slider-prev');
let imageArray = ['assets/bg/bg2-2.jpg', 'assets/bg/bg-2.jpg'];
var iterator = 0;

function getSlideNext(){
    iterator += 1;
    iterator %= 2;
    setBg();
}
function getSlidePrev(){
    iterator -= 1;
    if(iterator === -1)
        iterator = imageArray.length - 1;
    setBg();
}
const body = document.body;
function setBg(){
    body.style.backgroundImage = `url("${imageArray[iterator]}")`;
    body.style.transition = '2.5s';
}
nextButton.addEventListener('click', getSlideNext);
prevButton.addEventListener('click', getSlidePrev);