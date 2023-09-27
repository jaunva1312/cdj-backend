import { createRequire } from "module";
import MLR from "ml-regression-multivariate-linear";

const require = createRequire(import.meta.url);
const csv = require('csvtojson');

const csvFileBasePath = "./csvfiles/"; // Data
var csvData;// Parsed Data
var X = []; // Input 1
var Y = []; // Output
var predictionInput = [];
var regressionModel;


const order = {
    suggestedOrder: async function(customerID, customerGroupShort, productShort, date){
        
        
        try{
            const csvFilePath = getFilePath(customerGroupShort, productShort);
            csvData =  await csv().fromFile(csvFilePath);
            predictionInput = processData(customerID, date, csvData);
            performRegression(); // Train the model on training data
        
            return predictOutput(predictionInput)
          
        }catch(error){
            console.log(error);
            return "Something when worng with cvs file: " + error
        }
    }
}



function getFilePath(customerGroupShortName, productShortname){
    var filePath = csvFileBasePath + customerGroupShortName + '/' + productShortname + '.csv';
    return filePath
}

function processData(customerID, deliveryDate, rawDataFromFile) {
    
    var deliveryDayNumber = new Date(deliveryDate).getDay();
    var daysNumbersArray = [];
    var initialValues = [];
    
    /**
     * One row of the data object looks like:
     *   {
            Ruta: '7b7517d6',
            ClienteID: "e694958a",
            Cliente: 'Adriana García',
            FechaEntrega: '2/8/2023',
            FechaDevolucion: '3/8/2023',
            DiasDeVenta: '2',
            Entrega: '5',
            Devolucion: '2',
            Venta: '3'
        },
     */

    

    rawDataFromFile.forEach((row) => {
  
        if(row.ClienteID==customerID){
            X.push([dateToValue(row.FechaEntrega), parseFloat(row.Entrega.replace(/,/g, ''))]);
            Y.push([parseFloat(row.Venta.replace(/,/g, ''))]);
            let currentDayNumber = new Date(row.FechaEntrega).getDay();
            if(currentDayNumber == deliveryDayNumber){
                daysNumbersArray.push(currentDayNumber);
            }
        } 
    });

    var deliverInitialValue = getMostRepeatedAmmount(daysNumbersArray);
    initialValues.push(dateToValue(deliveryDate), deliverInitialValue);
    return initialValues
    
}

function performRegression() {
    regressionModel = new MLR(X,Y); // Train the model on training data

}

function predictOutput(input) {
    return regressionModel.predict(input);
}

function dateToValue(dateString) {
    let date = new Date(dateString);
    let converted = 25569.0 + ((date.getTime() - (date.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24));
    return converted;
}

function getMostRepeatedAmmount(amountArray){

    let variable = 0;
    let counter = 0;
    let count = 0;
    amountArray.map(p => {
        count = 0
        amountArray.map(x => {
          if (p == x) { count++ }
      })
      if (count > counter) {
        counter = count;
          variable = p;
      }
    });

    return variable  
}
  






export default order;
