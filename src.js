
//Background
const nextButton = document.querySelector('.slider-next');
const prevButton = document.querySelector('.slider-prev');
const NUMBER_OF_IMG = 13;
var iterator = getRandomInt(NUMBER_OF_IMG);
function getRandomInt(max){
    return Math.floor(Math.random() * max) + 1;
}
var freeze_check = true;
function getSlideNext(){
    if(freeze_check == true){
        iterator += 1;
        iterator %= NUMBER_OF_IMG + 1;
        if(iterator == 0)
            iterator = 1;
        setBg();
    }
}
function getSlidePrev(){
    if(freeze_check == true){
        iterator -= 1;
        if(iterator == 0)
            iterator = NUMBER_OF_IMG;
        setBg();
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
const body = document.body;
function setBg(){
    if(freeze_check == true){
        freeze_check = false;
        body.style.backgroundImage = `url("assets/bg/bg${iterator}.jpg")`;
        setTimeout(() => {freeze_check = true}, 2000);
    }
}
nextButton.addEventListener('click', getSlideNext);
prevButton.addEventListener('click', getSlidePrev);
document.addEventListener('DOMContentLoaded', setBg);



//Audio//

const playList = [
    {
        title: 'Девочка не плачь',
        src: '/assets/music/egor_krid.mp3',
        duration: '02:57'
    },
    {
        title: 'Девочка с картинки',
        src: '/assets/music/Egor_Krid_-_Devochka_s_kartinki.mp3',
        duration: '02:27'
    }
]

const audio = new Audio();
const playButton = document.querySelector('.play');
const prevSongButton = document.querySelector('.player-prev');
const nextSongButton = document.querySelector('.player-next');
var songIterator = 0;
audio.currentTime = 0;
audio.src = playList[0].src;
audio.volume = parseInt(document.querySelector('.range').value) / 100;
let isPlay = false;
function playAudio(){
    if(isPlay){
        isPlay = false;
        audio.pause();
    }
    else if(!isPlay){ 
        isPlay = true;
        audio.play();
    }
    playButton.classList.toggle('pause');
}
function nextSong(){
    songIterator += 1;
    songIterator %= 2;
    audio.src = playList[songIterator].src;
    audio.currentTime = 0;
    if(isPlay){
        audio.pause();
        playButton.classList.add('pause');
        audio.play();
    }
}
function prevSong(){
    songIterator -= 1;
    if(songIterator == -1) songIterator = 1;
    audio.src = playList[songIterator].src;
    audio.currentTime = 0;
    if(isPlay){
        audio.pause();
        playButton.classList.add('pause');
        audio.play();
    }
}
function songEnd(){
        nextSong();
        audio.play();
}
const volumeInput = document.querySelector('.range');
let down = false;
function setVolume() {
    audio.volume = parseInt(volumeInput.value) / 100;
}


volumeInput.addEventListener('mousedown', () => {
    down = true;
});
volumeInput.addEventListener('mousemove', () => {
    if(!down) return;
    setVolume();
})
volumeInput.addEventListener('mouseup', () => {
    down = false;
})
audio.addEventListener('ended', songEnd);
volumeInput.addEventListener('click', setVolume);
playButton.addEventListener('click', playAudio);
nextSongButton.addEventListener('click', nextSong);
prevSongButton.addEventListener('click', prevSong);


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

//Local Storage

const _name = document.querySelector('.name');
const city = document.querySelector('.city');
function setLocalStorage(){
    localStorage.setItem('_name', _name.value);
    localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage(){
    if(localStorage.getItem('_name')){
        _name.value = localStorage.getItem('_name');
    }
    if(localStorage.getItem('city')){
        city.value = localStorage.getItem('city');
    }
}
window.addEventListener('load', getLocalStorage);


//Weather widget//
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');

const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

var CITY_FIELD_EMPTY = -1;
var UNKNOWN_CITY_NAME = -2;
async function getWeather(){
    try{
        if(!city.value)
            throw CITY_FIELD_EMPTY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=00ff01a303438bd46bbf6089de899381&units=metric`;
        const res = await fetch(url);
        const data = await res.json();
        if(data.cod >= 400)
            throw UNKNOWN_CITY_NAME;
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        weatherIcon.style.opacity = 1;
        temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `Wind speed ${data.wind.speed.toFixed(0)} m/s`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
    }
    catch(e){
        if(e == UNKNOWN_CITY_NAME){
            weatherDescription.textContent = `Error!! City {${city.value}} was not found`;
            temperature.textContent = '';
            wind.textContent = '';
            humidity.textContent = '';
            weatherIcon.style.opacity = 0;
        }
    }
}

function setCity(event){
    if(event.code == 'Enter'){
        getWeather();
    }
}

document.addEventListener('DOMContentLoaded', getWeather);
window.addEventListener('load', getWeather);
city.addEventListener('keypress', setCity);