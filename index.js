const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const apiErrorContainer=document.querySelector(".api-fetch-error-container");

let currentTab= userTab;
const API_KEY="12b953ea1ea9c4fcd9b5470cfefe6100";
currentTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(clickedTab){
     if(clickedTab!=currentTab)
     {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        //agar search form wala container invisible hai toh
        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            //main pehle search wale tab pe tha, ab your weather wala app visible krna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display krna pdega so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();

        }
    }
}

userTab.addEventListener('click',()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinate nhi mile
        grantAccessContainer.classList.add("active");
    }
    else
    {
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grant access container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    apiErrorContainer.classList.remove("active");

    //Api call
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data=await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log(err);
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the element

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDescription]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put in ui elements
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText=weatherInfo?.weather?.[0]?.description;

    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText=`${weatherInfo?.main?.temp} °C`;

    windspeed.innerText=`${weatherInfo?.wind?.speed}    m/s`;

    humidity.innerText=`${weatherInfo?.main?.humidity}%`;

    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;

}


const messageText=document.querySelector("[data-messageText]")
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //hw - show an alert for no geolocation support available
        grantAccessBtn.style.display = "none";
        messageText.innerText = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position){
    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);


}
const grantAccessButton=document.querySelector("[data-grantaccess]");
grantAccessButton.addEventListener('click',getLocation);



const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value === "") 
        return;
    else
        fetchSearchWeatherInfo(searchInput.value);

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    apiErrorContainer.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data=await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

        if (!data.sys) {
            throw data;
        }
    }
    catch(error)
    {
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        apiErrorContainer.classList.add("active");
        
    }   
}




