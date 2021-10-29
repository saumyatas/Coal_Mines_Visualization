var evistudy = 
    /* color: #ff00ff */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[79.1151672297528, 19.868029319174227],
          [79.1151672297528, 19.837029093779364],
          [79.15344771681335, 19.837029093779364],
          [79.15344771681335, 19.868029319174227]]], null, false),
    geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[79.13203579965962, 19.85569590925576],
          [79.13203579965962, 19.848833868667082],
          [79.1379581171645, 19.848833868667082],
          [79.1379581171645, 19.85569590925576]]], null, false);


//-----------------------------------LANDSAT-8 ---------------------------------------------------------------


var imageCollection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  .filterBounds(studyarea);

function maskL8sr(imageCollection) {
  var cloudShadowBitMask = 1 << 3;
  var cloudsBitMask = 1 << 5;

  var qa = imageCollection.select('pixel_qa');

  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));

  return imageCollection.updateMask(mask).divide(10000)
      .select("B[0-9]*")
      .copyProperties(imageCollection, ["system:time_start"]);
}

// Make a list of years, then for each year filter the collection, 
// mask clouds, and reduce by median. Important to add system:time_start 
// after reducing as this allows you to filter by date later.
var stepList = ee.List.sequence(2014,2021);

var filterCollection = stepList.map(function(year){
  var startDate = ee.Date.fromYMD(year,1,1);
  var endDate = ee.Date.fromYMD(year,12,31);
  var composite_i = imageCollection.filterDate(startDate, endDate)
                        .map(maskL8sr)
                        .median()
                        .set('system:time_start',startDate);
  return composite_i;
});

var yearlyComposites = ee.ImageCollection(filterCollection);
print(yearlyComposites, 'Masked and Filtered Composites');

//----------------------------------------------------EVI Index-------------------------------------------

// EVI = 2.5 * ((NIR - Red) / (NIR + 6 * Red – 7.5 * Blue + 1))
function evi(img){
  var eviImg = img.select(['B5','B4','B2'],['nir','red','blue']);
  eviImg = eviImg.expression(
    '(2.5 * ((NIR - RED)) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
      'NIR': eviImg.select('nir'),
      'RED': eviImg.select('red'),
      'BLUE': eviImg.select('blue')
    }).rename('EVI');
  return img.addBands(eviImg);
}

yearlyComposites = yearlyComposites.map(function(image){
  return evi(image);
});

print(yearlyComposites, 'With EVI as Band');

// Create image collection of yearly composites, selecting the EVI band.
var eviCollection = yearlyComposites.select('EVI');

// Create a line chart to display EVI time series for a selected point.
// Display chart in the console.
var chart = ui.Chart.image.series({
  imageCollection: eviCollection.select('EVI'),
  region: geometry,
  scale: 30
}).setOptions({title: 'EVI Over Time'});

print(chart);

// //----------------------------------------------------NDBI Index-------------------------------------------

// NDBI = (SWIR – NIR) / (SWIR + NIR)
function ndbi(img){
  var ndbiImg = img.select(['B7','B5'],['swir','nir']);
  ndbiImg = ndbiImg.expression(
    '((SWIR - NIR) / (SWIR + NIR))', {
      'NIR': ndbiImg.select('nir'),
      'SWIR': ndbiImg.select('swir')
    }).rename('NDBI');
  return img.addBands(ndbiImg);
}

yearlyComposites = yearlyComposites.map(function(image){
  return ndbi(image);
});

print(yearlyComposites, 'With NDBI as Band');

// Create image collection of yearly composites, selecting the EVI band.
var ndbiCollection = yearlyComposites.select('NDBI');

// Create a line chart to display EVI time series for a selected point.
// Display chart in the console.
var chart2 = ui.Chart.image.series({
  imageCollection: ndbiCollection.select('NDBI'),
  region: geometry,
  scale: 30
}).setOptions({title: 'NDBI Over Time'});

print(chart2);


//------------------------------------Vegetation Graph-----------------------------------

// Load Landsat 7 Collection 1 Tier 1 8-Day NDVI Composite
var collectionl7 = ee.ImageCollection("LANDSAT/LE07/C01/T1_8DAY_NDVI").select('NDVI')
print (collectionl7)

// Create and print the chart.
print(ui.Chart.image.series(collectionl7, geometry , ee.Reducer.mean(), 100).setOptions({
      interpolateNulls: true,
      lineWidth: 1,
      pointSize: 3,
      title: 'Mines',
      hAxis: { title: 'year' },
      vAxis: { minValue: 0, maxValue: 1, title: 'NDVI'}
}));

//----------------------------------------------NDBI Timeseries GIF -------------------------

var text = require('users/gena/packages:text');

// Create a list of years for annotation
var yearNames = ee.List([ '2014', '2015', '2016','2017', '2018','2019','2020','2021']);
var ndbiWithYear = ndbiCollection.map(function(feat){
  return feat.set('year', yearNames.getString(
                      ee.Number.parse(feat.getString('system:index'))));
});

print(ndbiWithYear, 'year');

var gifParams = {
  'region': studyarea,
  'dimensions': 800,
  'framesPerSecond': 1,
  'format': 'gif'
};

var annotations = [{
  position: 'bottom',
  offset: '10%',
  margin: '20%',
  property: 'year',
  scale: Map.getScale()*3
  }];
  
var vis = {min: -0.4,
  max: 0.4,
  palette: [
    "006837", "1a9850", "66bd63", "a6d96a" , 
    "fee08b" , "fdae61", "f46d43","d73027", "a50026", 
  ]
};
var timeSeriesgif = ndbiWithYear.map(function(image) {
  return text.annotateImage(image, vis, studyarea, annotations);
});

// Print the GIF URL to the console
print(timeSeriesgif.getVideoThumbURL(gifParams));

// Render the GIF animation in the console.
print(ui.Thumbnail(timeSeriesgif, gifParams));


//------------------------------------------- Timeseries GIF -------------------------

var text = require('users/gena/packages:text');

// Create a list of years for annotation
var yearNames = ee.List([ '2014', '2015', '2016','2017', '2018','2019','2020','2021']);
var rgbcomposite = yearlyComposites.map(function(feat){
  return feat.set('year', yearNames.getString(
                      ee.Number.parse(feat.getString('system:index'))));
});

var gifParams = {
  'region': studyarea,
  'dimensions': 800,
  'framesPerSecond': 1,
  'format': 'gif'
};

var annotations1 = [{
  position: 'bottom',
  offset: '10%',
  margin: '20%',
  property: 'year',
  scale: Map.getScale()*3
  }];

var visParams = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 0.3,
  gamma: 1.4,
};

var timeSeriesgif1 = rgbcomposite.map(function(image) {
  return text.annotateImage(image, visParams, studyarea, annotations1);
});

// Print the GIF URL to the console
print(timeSeriesgif1.getVideoThumbURL(gifParams));

// Render the GIF animation in the console.
print(ui.Thumbnail(timeSeriesgif1, gifParams));
