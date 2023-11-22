
const Devolution = {

    getWeekReturnPorcentage: function(inputQuantity, returnQuantity){
        
        if(returnQuantity > 0){
            return Number(((returnQuantity/inputQuantity)*100).toFixed(2));
        }
        return 0
    }
}


export default Devolution;
