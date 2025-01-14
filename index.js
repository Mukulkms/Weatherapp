let tem = document.querySelector('.temp');
let time_date = document.querySelector('.time');
let place = document.querySelector('.location');
let condition = document.querySelector('.condition');
let alertmsg = document.querySelector('.alert');
let airqlty = document.querySelector('.air');
const searchbtn = document.getElementById('search');

searchbtn.addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput');
    const searchValue = searchInput.value;
    if (searchValue.trim() !== '') {
        search(searchValue);
        searchInput.value = '';
    }
});

function search(loc) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=effe8931691b48eaa9281233251401&q=${loc}&days=7&aqi=yes&alerts=yes`)
        .then(res => res.json())
        .then(data => {
            clearOldData(); // Clear old data before adding new content
            const location = data.location;
            const current = data.current.condition;
            let index = data.current.air_quality["gb-defra-index"];
            let quality = document.querySelector('.quality');
            let forCast = document.querySelector('.d-temp');
            let max_min = document.querySelector('.max_min');
            let icons = document.querySelector('.icons');
            let forecast = data.forecast.forecastday;

            place.innerHTML = `<p>${location.name}, ${location.region}, ${location.country}</p>`;
            time_date.innerHTML = `Date & Time: ${location.localtime}`;
            condition.innerHTML = `${current.text}  <img src="https:${current.icon}" alt="">`;
            tem.innerHTML = `${data.current.temp_c} °C`;
            airqlty.innerHTML = `${data.current.air_quality.pm2_5}`;
            
            alertmsg.innerHTML = getAirQualityMessage(index);
            
            forecast.forEach(day => {
                quality.innerHTML=`${day.day.mintemp_c}/${day.day.maxtemp_c} °C`;
                const dateEle = document.createElement('p');
                dateEle.textContent = day.date;
                forCast.append(dateEle);

                const max_mintemp = document.createElement('p');
                max_mintemp.textContent = `${day.day.mintemp_c}/${day.day.maxtemp_c} °C`;
                max_min.append(max_mintemp);

                const condition = day.day.condition;
                const icon = condition.icon; 
                const ic = document.createElement('img');
                ic.src = `https:${icon}`; 
                ic.alt = 'Weather icon';
                icons.append(ic);
            });
        })
        .catch(error => console.error("Unable to fetch data", error));
}

function clearOldData() {
    document.querySelector('.d-temp').innerHTML = '';
    document.querySelector('.max_min').innerHTML = '';
    document.querySelector('.icons').innerHTML = '';
}

function getAirQualityMessage(index) {
    if (index === 1) {
        return 'Good: Air quality is considered satisfactory, and air pollution poses little or no risk.';
    } else if (index === 2) {
        return 'Fair: Air quality is acceptable, but some pollution may pose a moderate risk for sensitive individuals.';
    } else if (index === 3) {
        return 'Moderate: Air quality is acceptable, but health concerns may arise for sensitive individuals.';
    } else if (index === 4) {
        return 'Unhealthy: Air quality poses health risks for the general population.';
    } else if (index >= 5) {
        return 'Hazardous: Air quality poses serious health risks for everyone.';
    }
    return '';
}
