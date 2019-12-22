// Create Basic Map
var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
});

// Add basic tile layer (background)
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);


//=========================================================
// Create url variable for All Earthquakes for the last 7 days
var usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//=========================================================
// Create Circle-property function
function circles(feature) {
    return {
    radius: feature.properties.mag ** 2,
    fillColor: quakeColor(feature.properties.mag),
    color: '#000000',
    weight: 1,
    opacity: 1,
    fillOpacity: .80
    }
};

//--------------------------------------------------------------------
// Create Color-Switch Function that correlates with Quake Magnitude
function quakeColor(magnitude) {

    switch (true) {
    case magnitude < 1:
      return "#B7DF5F";
    case magnitude < 2:
      return "#DCED11";
    case magnitude < 3:
      return "#EDD911";
    case magnitude < 4:
      return "#EDB411";
    case magnitude < 5:
      return "#ED7211";
    default:
      return "#ED4311";
    }
  }

//--------------------------------------------------------------------
// Create Pop-ups with GeoJSON info
function onEachFeature(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.place 
    + "</h2><hr><h2>" + `Magnitude: ${feature.properties.mag}`  
    + "</h2><hr><h3>" + new Date(feature.properties.time) + "</h3>");
  }  

//====================================================================
// Read in the data using D3 & add circles, pop-ups to map
d3.json(usgsUrl, earthquakeData => {
    var earthquakes = L.geoJSON(earthquakeData, {

        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng)
        },
        style: circles,
        onEachFeature: onEachFeature


    }).addTo(myMap)




// Create Legend
var legend = L.control({ position: "bottomright" });


legend.onAdd = function() {
//   var div = L.DomUtil.create("div", "info legend");
  var magGroups = ["0-1","1-2","2-3","3-4","4-5","5+"];
  var colors = ["#B7DF5F", "#DCED11", "#EDD911", "#EDB411", "#ED7211", "#ED4311"];
//   var labels = [];




    var div = L.DomUtil.create("div", "legend");

    magGroups.forEach((group, index) => {
        div.innerHTML += `<i style="background: ${colors[index]}"></i><span>${group}</span><br>`;
    })

    
    // div.innerHTML += `<i style="background: ${colors[0]}"></i><span>0-1</span><br>`;
    // div.innerHTML += `<i style="background: ${colors[1]}"></i><span>1-2</span><br>`;
    // div.innerHTML += `<i style="background: ${colors[2]}"></i><span>2-3</span><br>`;
    // div.innerHTML += `<i style="background: ${colors[3]}"></i><span>3-4</span><br>`;
    // div.innerHTML += `<i style="background: ${colors[4]}"></i><span>4-5</span><br>`;
    // div.innerHTML += `<i style="background: ${colors[5]}"></i><span>5+</span><br>`;
    
    return div;
};
  
  

// Adding legend to the map
legend.addTo(myMap);



})



