import Sale from '../models/sale.model.js'


const sale = {

    getSale: async function (req,res){
        try {
            const sale = await Sale.getSaleById(req.params.id);
            res.send(sale);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the sale: '  + error
            });
        }  
    },

    createSale: async function (req,res) {
        try {
            const newSale = await Sale.createSale(req.body);
            res.send(newSale);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong creating the sale: '  + error
            });
        } 
    },

    updateSale: async function(req,res) { 
        
        try {
            const sale = await Sale.updateSale(req.body, req.params.id);
            res.send(sale);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong updating the sale: '  + error
            });
        } 

    },

    deleteSale: async function(req,res) { 

        try {
            const deleteSaleRow = await Sale.deleteSale(req.params.id);
            
            if(deleteSaleRow < 1){
                return res.status(404).json({
                    menssage: 'Sale not found'
                });
            }
            res.sendStatus(204);
                      
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong deleting the sale: ' + error
            });
        }
    },


    getSalesByProduct: async function(req,res) { 

        try {
            
            const saleData = await Sale.getSalesByDateAndProduct(req.query.start_date, req.query.end_date, req.query.product_name);

            if(saleData == null) return res.status(404).json({
                menssage: 'Sale information not found'

            });

            res.send(saleData);  
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the sale information, ' + error
            });
        }

    },

    getSalesSumaryByCustomerGroup: async function(req,res) {
        let saleData;

        try {

            if(req.query.start_date != '' && req.query.end_date != '' && req.query.customer_group_id != ''){

                saleData = await Sale.getSalesSumaryByCustomerGroudId(req.query.start_date, req.query.end_date, req.query.customer_group_id);
            }else{
                return res.status(500).json({
                    message: 'Querey parameters start_date, end_date and customer_group_id are required'
                });
            }
            
            if(saleData == null) return res.status(404).json({
                menssage: 'Sales information not found'

            });

            res.send(saleData);  

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the summary of sales information by customer group:, ' + error
            });
        }

    },

    getSalesDetailsByCustomerGroup: async function(req,res) {
        let saleData;

        try {

            if(req.query.start_date != '' && req.query.end_date != '' && req.query.customer_group_id != ''){

                saleData = await Sale.getSalesDetailsByCustomeId(req.query.start_date, req.query.end_date, req.query.customer_group_id, req.query.product_name);
            }else{
                return res.status(500).json({
                    message: 'Querey parameters start_date, end_date and customer_group_id are required'
                });
            }
            
            if(saleData == null) return res.status(404).json({
                menssage: 'Sales information not found'

            });

            res.send(saleData);  

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the sales information details by customer group:, ' + error
            });
        }

    },

    getSalesByWeek: async function(req,res) {
        let saleData;

        try {

            if(req.query.year != '' && req.customer_group_name != ''){

                saleData = await Sale.getSalesDetailsByCustomeId(req.query.start_date, req.query.end_date, req.query.customer_group_id, req.query.product_name);
            }else{
                return res.status(500).json({
                    message: 'Querey parameters year and customerGroupName are required'
                });
            }
            
            if(saleData == null) return res.status(404).json({
                menssage: 'Sales information not found'

            });

            res.send(saleData);  

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the sales information by week:, ' + error
            });
        }

    },
    

}

export default sale