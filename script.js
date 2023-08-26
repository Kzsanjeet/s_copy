let info = document.querySelector(".info")
let searchButton = document.querySelector('#searchBtn')
let main = document.querySelector(".main")

//online or not
function isOnline() {
    return navigator.onLine;
}

function weatherApp(city) {
    let p = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7909a3f6027a002f28a9f982feb7917c&units=metric`)
    p.then((response) => {
        return response.json();
    }).then((data) => {
        if (data.cod === 200) {
            const {
                name,
                main: {
                    temp: temperature,
                    humidity: humidityV,
                    pressure: pressureV,
                },
                weather: [{ description }],
                wind: { speed },
                dt: timeValue,
            } = data;


            //to store data in local storage...
            localStorage.setItem(name,JSON.stringify(data))
            // localStorage.clear()
            //

            let placeName = data.name;
            let weatherPic = data.weather[0].icon;
            let weatherEL = data.weather[0].description;
            info.innerHTML = `
            <div class='min-max'>
                <span class="heading">${placeName}</span>
                <span class="temperature">${Math.floor(temperature)}°c</span>
                <img class="imageJs" src="http://openweathermap.org/img/w/${weatherPic}.png">
                <h4>${weatherEL}</h4>
                <div id="weat">
                    <div class='extra'>max/min temp:<br> <p>${data.main.temp_max}°c <br>${data.main.temp_min}°c</p></div>
                    <div class='extra'>Wind-speed:<br> <p>${speed}</p></div>
                    <div class='extra'>Humidity:<br><p> ${humidityV}</p></div>
                    <div class='extra'>Pressure:<br> <p>${pressureV}atm</p> </div>
                </div>
            </div>
            `;

            saveWeatherDataToDatabase(city, data)
                .then(response => {
                    console.log(response); // Log the response from the server
                })
                .catch(error => {
                    console.error(error);
                });

        } else {  // if failed in finding the city, gives City not found as a result
            info.innerHTML = `Cannot find the location..`;
        }
    }).catch((err)=>{
        console.log(err)
        info.innerHTML = "somthing went wrong.!"
    })
}

//for getting data from ls

function backupData(city) {
    console.log("localStorage: " + city);
    const data = localStorage.getItem(city);
    if (!data) {
        console.log("sorry, data does not found.");
        info.textContent = "NO Data available";
        return; // Exit the function if data is not available
    }
    try {
        const output = JSON.parse(data);
        let placeName = output.name;
        let weatherPic = output.weather[0].icon;
        let weatherEL = output.weather[0].description;
        info.innerHTML = `
        <div class='min-max'>
            <span class="heading">${placeName}</span>
            <span class="temperature">${Math.floor(output.main.temp)}°c</span>
            <img class="imageJs" src="http://openweathermap.org/img/w/${weatherPic}.png">
            <h4>${weatherEL}</h4>
            <div id="weat">
                <div class='extra'>max/min temp:<br> <p>${output.main.temp_max}°c <br>${output.main.temp_min}°c</p></div>
                <div class='extra'>Wind-speed:<br> <p>${output.wind.speed} m/s</p></div>
                <div class='extra'>Humidity:<br><p> ${output.main.humidity}%</p></div>
                <div class='extra'>Pressure:<br> <p>${output.main.pressure} atm</p> </div>
            </div>
        </div>
        `;
    } catch (error) {
        console.error("error occurred:", error);
    }
}


weatherApp("Solihull");

searchButton.addEventListener('click',()=>{
    let city = document.querySelector(".enterPlace")
    if(isOnline()){
        weatherApp(city.value);
    }else{
        backupData(city.value);
    }
    city.value = "";
})

//for time zone output
setInterval(()=>{
    document.querySelector(".watch").textContent = Date()
},1000)

// Save weather data to the local database
function saveWeatherDataToDatabase(city, data) {
    // Sending weather data to the PHP file
    return fetch("jvayeni.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ city, data })
    })
    .then(response => response.text())
    .catch(error => {
        throw new Error("Error saving data to the database.");
    });
}