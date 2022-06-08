
/* Global Variables */
const generate = document.querySelector("#generate");
const zip = document.querySelector("#zip");
const feelings = document.querySelector("#feelings");
const content= document.querySelector("#content")
const date= document.querySelector("#date")
const temp = document.querySelector("#temp");
const baseUrl = "http://api.openweathermap.org/data/2.5/forecast?zip=";
const apiKey = "&appid=38b19ffa02cf83dcd9b6484d7bcf17f3&units=imperial";

// Create a new date instance dynamically with JS
const d = new Date();

//let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
const newDate =d.toDateString();

generate.addEventListener("click", (performAction) => {
    performAction.preventDefault();
    getWeather(baseUrl, zip.value, apiKey)
    .then(function(data) {
        arrangeData(data)
       .then((datas)=> {
            postData("/add", datas)
            updateUI()
        })
    })
    
    })

const getWeather = async (baseUrl, zip, apiKey) => {
    const res = await fetch(baseUrl+zip+apiKey)
    try {
        const data = await res.json();
            console.log(data);
             return data;
        }catch(error){
            console.log("error",error);

        }
}
const arrangeData =async(data)=>{
    try{
        if(data.message){
            const datas ={
                date:newDate,
                temp:data.message,
                feeling:feelings.value
            }
            return datas;
        }else{
            const datas={
                date:newDate,
                temp:data.list[0].main.temp + "&#176",
                feeling:feelings.value
            }
            return datas;
        }
    }catch(error){
        console.log("error",error);
    }
}

const postData = async (url = '', contents = {}) => {
    const response =await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",

        },
        body: JSON.stringify(contents)
    });

    try {
        const newData = await response.json();
        return newData;
  }catch(error){
      console.log("error",error)
  }
}

const updateUI = async ()=> {
    const update = await fetch("/all");
    try {
        const updates =await update.json();
        date.innerHTML = `Date: ${updates.date}`;
        temp.innerHTML = `Temperature: ${updates.temp}`;
        content.innerHTML = `I feel: ${updates.feeling}`;
    }catch(error) {
        console.log("error", error);
    }
}