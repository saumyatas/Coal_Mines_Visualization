# Coal Mines Visualization on GEE
A visualization tool created on Google Earth engine (GEE) to help analyze the coal mining area and predict the period of mining operation. 
GEE is an open-source platform for geospatial data analysis and its visualization. We all know how tedious it is to download each satellite data tile and then curate it according to our need for further analysis. And if the area is large, say you are working on the entire country or on time series analysis, then downloading the satellite data (Landsat or Sentinel) for each and every region in a particular time range will take hours or days and require high density data storage. Even their analysis might need high end system with fast computing software. All this could be done in just few minutes and within 10-15 lines of code on GEE. Geospatial data computation on GEE not only saves time and storage but also provides flexibility. They have open-source [data catalog](https://developers.google.com/earth-engine/datasets/) including `Landsat` datasets, `Sentinel` datasets, `MODIS` Datasets, `NAIP` data, precipitation data, sea surface temperature data, CHIRPS climate data, and elevation data. You can check out this paper to know more about GEE platform. - [Google Earth Engine: Planetary-scale geospatial analysis for everyone](https://www.sciencedirect.com/science/article/pii/S0034425717302900)

For our current visualization we will import the Landsat 8 OLI/TIRS sensors tier 2 data, which is atmospherically corrected surface reflectance dataset. After applying cloud mask and cloud shadow mask, and filtering it from the year 2014 to 2021, image is clipped for the study area by extracting the pixels from the entire area and for each year. But in order to access GEE one will need to sign up on [Google Earth Engine](https://earthengine.google.com/) using your google account.


## Installing
```bash
git clone https://github.com/saumyatas/Coal_Mines_Visualization.git
```

## Visulization Plots
With the help of the surrounding areas of the mining area a NDVI reference graph is created to distinguish forest and water bodies from the mining area.

### NDVI reference chart
![NDVI reference chart](Plots/NDVI_ref.png)

With the help of change in NDVI we can predict that the period of operation for this mine started in early 2016 or late 2015.

### NDVI of the mining area
![NDVI_chart](Plots/NDVI_chart.png)

## Visulization GIFs

The expansion of mining area and change in operation can be visualized using Landsat series satellite data.

### Normalized Difference Built-up Index GIFs
![NDBI gifs](GIFs/NDBI.gif)

### RGB Visualization GIFs
![RGB gifs](GIFs/RGB.gif)

## Author
[Saumyata Srivastava](https://www.linkedin.com/in/ss-97b05a103/)

[![GitHub Saumyata Srivastava](https://img.shields.io/github/followers/saumyatas?label=follow&style=for-the-badge&logo=github&logoColor=white&labelColor=333333)](https://github.com/saumyatas)
[![Email](https://img.shields.io/badge/Mail-004788?style=for-the-badge&logo=gmail&logoColor=white)](mailto:saumyata.srivastava@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ss-97b05a103/)
[![kaggle](https://img.shields.io/badge/kaggle-31C3FF?style=for-the-badge&logo=kaggle&logoColor=white)](https://www.kaggle.com/saumyatas1202)
[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@srivastava.saumyata)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
