"use strict";
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT;
const app = express();
const axios = require("axios");
let name;
class Caching {
  constructor(obj) {
    this.obj = obj;
    this.timezone = Date.now();
  }
}

const cath = new Caching([]);
app.use(cors());

app.get("/", function (req, res) {
  res.send("Hello In Main");
});

app.get("/weather", function (req, res) {
  let cityName = req.query.city;

  if (cath.obj.length && cityName===name) {
    res.json({message:'from catch' , data:cath.obj ,time:cath.timezone });
  } else {
      name= req.query.city;
    let apiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=6abc756faa78444ba97690a208a18584`;
    axios.get(apiUrl).then((response) => {
      let weatherArray = response.data.data.map(
        (item) => new CityWeather(item)
      );
      res.json({message:'from API' , data:weatherArray ,time:Date.now() });
      cath.obj = weatherArray;
    });
  }
});

app.listen(port, console.log(`In port ${port}`));

class CityWeather {
  constructor(weather) {
    this.date = weather.valid_date;
    this.des = weather.weather.description;
  }
}
