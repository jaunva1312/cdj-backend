import {pool} from '../db.js'
import Order from '../models/order.model.js'


const order = {
    
    getCustomerOrderByProduct: async function(req,res) {
       
        try {
            var sql_customer = 'SELECT * FROM Customer WHERE CustomerID = ?';
            var sql_customerGroup = 'SELECT * FROM CustomerGroup WHERE CustomerGroupID = ?';
            var sql_product = 'SELECT * FROM Product WHERE ProductID = ?';

            const [rows_customer] = await pool.query(sql_customer,[req.params.customerID]); 

            if(rows_customer.length < 1) return res.status(404).json({
                menssage: 'Customer not found'

            });

            var customerGroupID = rows_customer[0].CustomerGroupID;

            const [rows_customerGroup] = await pool.query(sql_customerGroup,[customerGroupID]); 

            var customerGroupShortName = rows_customerGroup[0].ShortName;

            const [rows_product] = await pool.query(sql_product,[req.params.productID]); 

            if(rows_product.length < 1) return res.status(404).json({
                menssage: 'Product not found'

            });

            var productShortName = rows_product[0].ShortName;
            
            Order.suggestedOrder(req.params.customerID,customerGroupShortName,productShortName, req.params.date).then(data =>{
                var test = data;
                res.send(test);
            })

        } catch (error) {
            return res.status(500).json({
                message: error
            });
        }
        
    }

}

export default order