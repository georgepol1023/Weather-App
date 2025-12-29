const apiKey = "cd69b9cc5187a4c2c69cf366ef42c80d";

async function getWeatherData(city) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const [currRes, foreRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
        
        if (!currRes.ok || !foreRes.ok) {
            alert("City not found or API error");
            return;
        }

        const currData = await currRes.json();
        const foreData = await foreRes.json();

        updateUI(currData);
        updateForecast(foreData);
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

function updateUI(data) {
    document.getElementById("city").innerText = data.name;
    document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `${data.main.humidity}%`;
    document.getElementById("wind").innerText = `${data.wind.speed} km/h`;
    document.getElementById("feels-like").innerText = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("pressure").innerText = `${data.main.pressure} hPa`;
    document.getElementById("main-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    
    // FIX: Get current date (Monday, December 29, 2025)
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById("date").innerText = now.toLocaleDateString('en-US', options);
}

function updateForecast(data) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = ""; 

    // FIX: Instead of filtering for exactly 12:00, we take one reading every 8 entries 
    // (Since the API provides data every 3 hours, 8 entries = 24 hours).
    for (let i = 0; i < data.list.length; i += 8) {
        const dayData = data.list[i];
        const date = new Date(dayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        
        forecastDiv.innerHTML += `
            <div class="forecast-card">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png">
                <p><strong>${Math.round(dayData.main.temp)}°C</strong></p>
                <p style="font-size: 10px; opacity: 0.7;">${dayData.weather[0].main}</p>
            </div>
        `;
    }
}

// Event Listeners
document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.querySelector(".search-box input").value;
    getWeatherData(city);
});