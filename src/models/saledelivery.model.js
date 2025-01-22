import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'
import moment from 'moment';

class SaleDelivery  {

    static async getSalesDeliveries(sale_id){

        try {
            
            var sql =
            `
            SELECT 
                    sale_delivery.*, 
                    customer.name as customer_name,
                    product.name as product_name

                FROM
                    sale_delivery

                LEFT JOIN 
                    customer 
                ON 
                    sale_delivery.customer_id = customer.id

                LEFT JOIN 
                    product 
                ON 
                    sale_delivery.product_id = product.id_product
                WHERE
                    sale_delivery.sale_id = ?
            `;

            

            const [rows] = await pool.query(sql,[
                sale_id
            ]); 


            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 

    }

    static async getSaleDeliveryById(id){
        
        try {
            var sql = 'SELECT * FROM sale_delivery WHERE id_saledelivery = ?';
            
            const [rows] = await pool.query(sql,[id]); 

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        }  
    }

    static async createSaleDelivery(saleDeliveryObject){


        try{

            //saleDeliveryObject.id_saledelivery = createUniqueID();
            //saleDeliveryObject.date = moment().local().format('YYYY/MM/DD');
            
            var sql = `INSERT INTO sale_delivery(
                id_saledelivery,  
                sale_id,
                date,
                product_id, 
                quantity,
                price,
                customer_id) 
                VALUES(?,?,?,?,?,?,?)`;

            const {
                id_saledelivery,
                sale_id,
                date,
                product_id, 
                quantity,
                price,
                customer_id
            } = saleDeliveryObject
        
            const [rows] = await pool.query(sql,[
                id_saledelivery,
                sale_id,
                date,
                product_id,
                quantity,
                price,
                customer_id
            ]);

            return saleDeliveryObject;
            

        }catch(error){
            throw(error);
        }
    }

    static async updateSaleDelivery(saleDeliveryObject, id){

        try {

            var sql = 
                `
                UPDATE 
                    sale_delivery 
                SET
                    product_id = IFNULL(?,product_id),
                    quantity = IFNULL(?,quantity), 
                    price = IFNULL(?,price),
                    customer_id = IFNULL(?,customer_id)

                WHERE id_saledelivery = ?`;

            var sqlConsult = 'SELECT * FROM sale_delivery WHERE id_saledelivery = ?';


            const {
                product_id, 
                quantity,
                price,
                customer_id
            } = saleDeliveryObject

            const [result] = await pool.query(sql,[
                product_id, 
                quantity,
                price,
                customer_id,id
            ]);

    
            if(result.affectedRows == 0) throw ("Sale delivery not found");

            const [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw(error);
        }

    }

    static async deleteSaleDelivery(id){
        
        try {
            var sql = 'DELETE FROM sale_delivery WHERE id_saledelivery = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }
    

}

export default SaleDelivery