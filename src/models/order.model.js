import { createRequire } from "module";
import MLR from "ml-regression-multivariate-linear";

const require = createRequire(import.meta.url);
const csv = require('csvtojson');

const csvFileBasePath = "./csvfiles/"; // Data



const order = {
    suggestedOrder: async function(customerID, customerGroupShort, productShort, date){
        
        try{
            const csvFilePath = getFilePath(customerGroupShort, productShort);
            var csvData =  await csv().fromFile(csvFilePath);
            var predictionInputs = processData(customerID, date, csvData);
            var suggestedOrderData = predictOutput(predictionInputs);
            
            return suggestedOrderData

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
    
    var predictionDeliveryDayNumber = new Date(deliveryDate).getDay();
    var pastSalesAmountArray = [];
    var X = []; // Model inputs array: Date a
    var Y = []; // Model output array 
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

    //Process data from CVS
    rawDataFromFile.forEach((row) => {
        
        // Filter Customer Data from csc file
        if(row.ClienteID==customerID){
            //Create Input and Output arrays use in regression model
            X.push([dateToValue(row.FechaEntrega), parseFloat(row.Entrega.replace(/,/g, ''))]);
            Y.push([parseFloat(row.Venta.replace(/,/g, ''))]);

            //Create array for initial values: Date, Delivery
            let deliveryDayNumber = new Date(row.FechaEntrega).getDay();
            if(deliveryDayNumber == predictionDeliveryDayNumber){
                pastSalesAmountArray.push(parseFloat(row.Entrega.replace(/,/g, '')));
            }
        } 
    });

    var deliveryInitialValue = getMostRepeatedAmmount(pastSalesAmountArray);
    initialValues.push(dateToValue(deliveryDate), deliveryInitialValue);


    var regressionInputValues = {
        initialValues: initialValues,
        xArrayInput: X,
        yArrayOutput: Y 
    }
    
    return regressionInputValues
    
}


function predictOutput(regressionInput) {
    var regressionModel = new MLR(regressionInput.xArrayInput,regressionInput.yArrayOutput,[false,false]); // Train the model on training data
    var salePrediction = regressionModel.predict(regressionInput.initialValues);

    var orderPrediction = {
        salePredcition : salePrediction[0],
        standardError : regressionModel.stdError
    }

    return orderPrediction
}

function dateToValue(dateString) {
    let date = new Date(dateString);
    let converted = 25569.0 + ((date.getTime() - (date.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24));
    return Math.round(converted);
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
