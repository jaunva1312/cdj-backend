import SaleDelivery from '../models/saledelivery.model.js'


const saleDelivery = {

    getSalesDeliveries: async function(req,res) {
        let salesDeliveries;

        try {

            if(req.query.sale_id != ''){

                salesDeliveries = await SaleDelivery.getSalesDeliveries(req.params.saleid);
            }else{
                return res.status(500).json({
                    message: 'Query parameter sale_id is required'
                });
            }
            
            if(salesDeliveries == null) return res.status(404).json({
                menssage: 'Sales deliveries information not found'

            });

            res.send(salesDeliveries);  

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the sales deliveries:, ' + error
            });
        }

    },

    getSaleDelivery: async function (req,res){
        try {
            const saleDelivery = await SaleDelivery.getSaleDeliveryById(req.params.id);
            res.send(saleDelivery);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the sale delivery: '  + error
            });
        }  
    },

    createSalesDeliveries: async function (req,res) {
        const newSalesDeliveries = [];
        const bodies = req.body;

        //console.log(req.body);
        
        try {
            for await (let obj of bodies){
                newSalesDeliveries.push (await SaleDelivery.createSaleDelivery(obj));
            }
            res.send(newSalesDeliveries);
            
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong creating the sale delivery: '  + error
            });
        }
    },

    updateSaleDelivery: async function(req,res) { 
        
        try {
            const saleDelivery = await SaleDelivery.updateSaleDelivery(req.body, req.params.id);
            res.send(saleDelivery);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong updating the sale delivery: '  + error
            });
        } 

    },

    deleteSaleDelivery: async function(req,res) { 

        try {
            const deleteSaleDeliveryRow = await SaleDelivery.deleteSaleDelivery(req.params.id);
            
            if(deleteSaleDeliveryRow < 1){
                return res.status(404).json({
                    menssage: 'Sale delivery not found'
                });
            }
            res.sendStatus(204);
                      
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong deleting the sale delivery: ' + error
            });
        }
    },


    

}

export default saleDelivery