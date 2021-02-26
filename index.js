const auth = "a89e72863262ecf733affa12e9cfa8e2";
var city = "Lisbon";
var results = document.querySelector('.results').children[0];
var searchInput = document.querySelector('.searchInput');
var searchForm = document.querySelector('.searchForm');

//EVENTLISTENERS
searchInput.addEventListener("input", updateInput);
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clear();
    weatherInfo();
})

//FUNCTIONS
//updates all weather city info
function updateInput(e){
 city = e.target.value;
}

//get all dates 
function getDates() {
    let startDate = new Date();
    let daysToAdd = 7;
    let aryDates = [];
    let first = true;

    for (let i = 0; i <= daysToAdd; i++) {
        let currentDate = new Date();
        currentDate.setDate(startDate.getDate() + i);

        //first day date format changes
        if(first){
            //cast to number inside push to add month date as it's always 1 value behind
            aryDates.push(currentDate.getDate() + "/" + (+currentDate.getMonth()+ +1) + "/" + currentDate.getFullYear());
            first = false;
        }
        else
            aryDates.push(currentDate.getDate() + "/" + (+currentDate.getMonth() + +1));
    }
    return aryDates;
}



async function weatherInfo(){

    //Get city coordinates
    var cityCoor = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid="+auth+"";
    const cityFetch = await fetch(
        cityCoor, {
        method: 'GET'
    }
    );

    const dataCity = await cityFetch.json();

    //get daily forecast for 7 days
    var dataUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+dataCity[0].lat+"&lon="+dataCity[0].lon+"&exclude=minutely,hourly&units=metric&appid="+auth+"";
    const dataFetch = await fetch(
        dataUrl, {
        method: 'GET'
    }
    );

    const data = await dataFetch.json();

    //Create city header
    const cityComponent = document.createElement("div");
    cityComponent.classList.add("cityComponent");
    cityComponent.innerHTML = `<h1>${dataCity[0].name},${dataCity[0].country}</h1>
    <i class="far fa-map-pin"></i>
    <p>[${dataCity[0].lat},${dataCity[0].lon}]</p>`;


    results.appendChild(cityComponent);

    //Foreach day
    let first = true;

    //get all 7 dates with the proper format
    const dates = getDates();
    let dateToadd;

    data.daily.forEach(day => {
    const dateComponent = document.createElement("article");
    dateComponent.classList.add("day");

    //SetIcon
    let currentTemp = Math.round(data.current.temp);
    let maxTemp = Math.round(day.temp.max);
    let iconFirst = (currentTemp <= -1) ? `<i class="fas fa-icicles"></i>` : ((currentTemp >= 0 && currentTemp <= 10)) ? `<i class="far fa-snowflake"></i>` : ((currentTemp >= 11 && currentTemp <= 25)) ? `<i class="far fa-sun"></i>` : `<i class="fas fa-fire"></i>`;
    let icon = (maxTemp <= -1) ? `<i class="fas fa-icicles"></i>` : ((maxTemp >= 0 && maxTemp <= 10)) ? `<i class="far fa-snowflake"></i>` : ((maxTemp >= 11 && maxTemp <= 25)) ? `<i class="far fa-sun"></i>` : `<i class="fas fa-fire"></i>`;

    if(first){
        dateToadd = `
        <div class="dateComponent">
        <h1>Today</h1>
        <p>${dates.shift()}</p>
        </div>
        <div class="weatherComponent">
        ${iconFirst}
        <h1>${currentTemp}</h1>
        </div>
        `;
        first = false;
    }
    else
        dateToadd = `
        <div class="dateComponent">
        <p>${dates.shift()}</p>
        </div>
        <div class="weatherComponent">
        ${icon}
        <h1>${maxTemp}</h1>
        </div>
        `;
    

    dateComponent.innerHTML = `
    ${dateToadd}
    <div class="detailComponent">
        <ul>
            <li><i class="fal fa-temperature-low"></i>${day.temp.max}º/${day.temp.min}º</li>
            <li><i class="fas fa-wind"></i>${day.wind_speed} m/s</li>
            <li><i class="fal fa-humidity"></i>${day.humidity}%</li>
            <li><i class="far fa-long-arrow-alt-down"></i>${day.pressure} hPa</li>
        </ul>
    </div>
    </article>`;
    results.appendChild(dateComponent);
})

}

//clears the content on search
function clear(){
    results.innerHTML = "";
    searchInput.value = "";
}

weatherInfo();