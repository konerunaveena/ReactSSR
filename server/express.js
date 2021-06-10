const express = require('express');
const cors = require('cors');
const React = require('react');
const ReactDOM = require('react-dom')
const ReactDOMServer = require('react-dom/server');
const ReactJSDOM = require('react-jsdom');
const JSReports = require('@carrier/JSReports');
const axios = require('axios');
// create express application
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false })) // if we are using express version above 4.16 use this else use above one 
app.use(express.json());

app.get("/downloadPDF", async (req, res) => {
  const headerInfo = {
    userName : "Naveena Koneru",
    formatTitle :"30KAV 0800",
    subTitle : "Air-cooled chiller with variable-speed screw compressor",
    imgPath : "https://stecatbuildersdev.blob.core.windows.net/ecatui/ecatimages/carrier.png",
    date : new Date(),
    reportName  : "Standart Report",
    imgPathOne :"https://stecatbuildersdev.blob.core.windows.net/ecatui/ecatimages/30KAV.png"
  }
 
  let response = ReactDOMServer.renderToString(await JSReports.Report({headerInfo : headerInfo}))
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST',
    Authorization: req.headers.authorization,
    Cookie: 'render-complete=true',
  }
  const data = JSON.stringify({
    template: {
      shortid: 'l1DbOPsN5',
      recipe: 'chrome-pdf',
      engine: 'handlebars',
      chrome: {
        width: '210mm',
        height: '297mm',
      },
      content: response,
    }
  });
const resp = await axios.post('https://apim-carrier-qa.azure-api.net/jsrd/api/report', data, {
  headers: headers,
   responseType: 'arraybuffer'
});

res.contentType("application/pdf")
return res.send(resp.data);
  //res.send(response)
});
// run express server on port 9000
app.listen('9000', () => {
  console.log('Express server started at http://localhost:9000');
});