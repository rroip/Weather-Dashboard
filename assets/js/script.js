
let city="";
let searchCity = $("#search-city");
let searchButton = $("#search-button");
let currentCity = $("#current-city");
let currentTemperature = $("#temperature");
let currentHumidty= $("#humidity");
let currentWSpeed=$("#wind-speed");
let currentUvindex= $("#uv-index");
let sCity=[];





let APIKey="05eb9045cf881d6d2d0d7131aa850ae6";
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}


function currentWeather(city){

    let queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        
        console.log(response);
        let weathericon= response.weather[0].icon;
        let iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        let date = new Date(response.dt*1000).toLocaleDateString();
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
        let tempF = (response.main.temp);
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        $(currentHumidty).html(response.main.humidity+"%");
        let ws = response.wind.speed;
        let windsmph = (ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+"MPH");
        
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
         
        if(response.cod===200){
            sCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity===null){
                sCity = [];
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
} 

// UV index color modifier
function setUVIndexColor(uvi) {
    if (uvi < 3) {
        return 'green';
    } else if (uvi >= 3 && uvi < 6) {
        return 'yellow';
    } else if (uvi >= 6 && uvi < 8) {
        return 'orange';
    } else if (uvi >= 8 && uvi < 11) {
        return 'red';
    } else return 'purple';
}

function UVIndex(ln,lt){
   
    let uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);

            });
}



// 5 days forecast for the current city.
function forecast(cityid){
    let queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<=5;i++){
            let date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            let iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            let iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            let tempK= response.list[((i+1)*8)-1].main.temp;
            let tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            let humidity= response.list[((i+1)*8)-1].main.humidity;
            let wind= response.list[((i+1)*8)-1].wind.speed;
        
            $("#date"+i).html(date);
            $("#img"+i).html("<img src="+iconurl+">");
            $("#temp"+i).html(tempF+"&#8457");
            $("#humidity"+i).html(humidity+"%");
            $("#wind"+i).html(wind+"mph")
        }
        
    });
}

function addToList(c){
    const listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}
// search history display
function invokePastSearch(event){
    const liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}

function loadlastCity(){
    $("ul").empty();
    const sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}

$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);




