import Sale from '../models/sale.model.js'
import SaleDelivery from '../models/saledelivery.model.js';


const sale = {

    getSales: async function(req,res) {
        let sales;

        try {

            if(req.query.start_date != '' && req.query.end_date != '' && req.query.customer_group_id != ''){

                sales = await Sale.getSales(req.query.start_date, req.query.end_date, req.query.customer_group_id);
            }else{
                return res.status(500).json({
                    message: 'Query parameters start_date, end_date and customer_group_id are required'
                });
            }
            
            if(sales == null) return res.status(404).json({
                menssage: 'Sales information not found'

            });

            res.send(sales);  

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the sales:, ' + error
            });
        }

    },

    getCustomerLastSales: async function(req,res) {
        let sales;

        try {

            if(req.query.number != '' && req.query.customer_id != ''){

                sales = await Sale.getCustomerLastSales(req.query.customer_id, req.query.number);
            }else{
                return res.status(500).json({
                    message: 'Query parameters customer_id as number are required'
                });
            }
            
            if(sales == null) return res.status(404).json({
                menssage: 'Sales information not found'

            });

            res.send(sales);  

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the last sales:, ' + error
            });
        }

    },

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
        const newSalesDeliveries = [];
        const salesDeliveries = req.body.sales_deliveries;
        const saleId = req.body.id_sale;
        try {
            let newSale = await Sale.createSale(req.body);

            if(salesDeliveries!= null){

                for await (let saleDelivery of salesDeliveries){
                    saleDelivery.id = saleId;
                    newSalesDeliveries.push (await SaleDelivery.createSaleDelivery(saleDelivery));
                }
                
                newSale.sales_deliveries = newSalesDeliveries;
            }
            
            //res.send(newSale);
            return res.status(201).json(newSale);
            
        } catch (error) {
            if (error && error.status === 409) {
                return res.status(409).json({
                    message: error.message,
                    code: error.code || 'DUPLICATE_SALE_ID'
                });
            }
            return res.status(500).json({
                message: 'Something goes wrong creating the sale: ' + error
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

                saleData = await Sale.getSalesDetailsByCustomerId(req.query.start_date, req.query.end_date, req.query.customer_group_id, req.query.product_name);
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

                saleData = await Sale.getSalesByWeek(req.query.year, req.query.customer_group_name);
            }else{
                return res.status(500).json({
                    message: 'Query parameters year and customer_group_name are required'
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

    getCustomersPercentageByProduct: async function(req,res) {
        let saleData;

        try {

            if(req.query.productId != ''){

                saleData = await Sale.getCustomersPercentageByProduct(req.query.productId, req.query.start_date, req.query.end_date);
            }else{
                return res.status(500).json({
                    message: 'Query parameter productId is required'
                });
            }
            
            if(saleData == null) return res.status(404).json({
                menssage: 'Sales information not found'

            });

            res.send(saleData);  

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the customers percentage by product:, ' + error
            });
        }

    },

    getCustomersSalesByProductAndDates: async function(req,res) {
        let saleData;

        try {

            if(req.query.productId != '' && req.query.customer_group_id != '' && req.query.start_date && req.query.end_date){

                saleData = await Sale.getCustomersSalesByProductAndDates(req.query.productId, req.query.customer_group_id, req.query.start_date, req.query.end_date);
            }else{
                return res.status(500).json({
                    message: 'Query parameter productId,customerGroupId, startDate and endDate are required'
                });
            }
            
            if(saleData == null) return res.status(404).json({
                menssage: 'Sales information not found'

            });

            res.send(saleData);  

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the customers percentage by product:, ' + error
            });
        }

    },
    

}

export default sale