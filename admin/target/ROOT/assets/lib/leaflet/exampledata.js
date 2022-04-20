(function() {

  var basemaps = {
//    Grayscale: L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
//      maxZoom: 18,
//      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//    }),
//    Streets: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//      maxZoom: 19,
//      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//    })
  };

  var groups = {
    cities: new L.LayerGroup(),
    restaurants: new L.LayerGroup(),
    dogs: new L.LayerGroup(),
    cats: new L.LayerGroup()
  };

  L.marker([23.61, 115.02]).bindPopup('Littleton, CO.').addTo(groups.cities);
  L.marker([23.74, 114.99]).bindPopup('Denver, CO.').addTo(groups.cities);
  L.marker([23.73, 114.8]).bindPopup('Aurora, CO.').addTo(groups.cities);
  L.marker([23.77, 115.23]).bindPopup('Golden, CO.').addTo(groups.cities);

  L.marker([23.69, 114.85]).bindPopup('A restaurant').addTo(groups.restaurants);
  L.marker([23.69, 115.12]).bindPopup('A restaurant').addTo(groups.restaurants);

  L.marker([23.79, 114.95]).bindPopup('A dog').addTo(groups.dogs);
  L.marker([23.79, 115.22]).bindPopup('A dog').addTo(groups.dogs);

  L.marker([23.59, 114.75]).bindPopup('A cat').addTo(groups.cats);
  L.marker([23.59, 115.02]).bindPopup('A cat').addTo(groups.cats);

  window.ExampleData = {
    LayerGroups: groups,
    Basemaps: basemaps
  };

}());
