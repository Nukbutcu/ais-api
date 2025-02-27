const express = require('express');
const path = require('path');
const cors = require('cors');


const api = require('./api');
const areaApi = require('./area');
/**
 * Inits Database and triggers seeding if no database exists
 * @constructor
 * @param {int} port - Portnumber
 */
function init(port) {
  const app = express();
  app.use(cors());
  app.set('port', (port ||process.env.PORT || 5000))

  app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/index.html'));
  });

  app.get('/getLastPositionFromVF/:mmsi', (req, res) => {
    api.getLocationFromVF(req.params.mmsi, (result) => {
      res.send(result);
    });
  });

  app.get('/getLastPositionFromMT/:mmsi', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");	
    api.getLocationFromMT(req.params.mmsi, (result) => {
      res.send(result);
    });
  });

  app.get('/getLastPosition/:mmsi', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");	
    api.getLocation(req.params.mmsi, (result) => {
      res.send(result);
    });
  });

  // e.g. /getVesselsInArea/WMED,EMED
  app.get('/getVesselsInArea/:area', async (req, res) => {
    const result = await areaApi.fetchVesselsInArea(req.params.area.split(','), (result) => {
      res.json(result);
    });
  });

  app.get('/getVesselsInPort/:shipPort', (req, res) => {
    api.getVesselsInPort(req.params.shipPort, (result) => {
      res.send(result);
    });
  });  

  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
}

module.exports = {
  init: init,
};
