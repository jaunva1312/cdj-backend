import {pool} from '../db.js'
import {createUniqueID} from '../libs/dataBase.js'

class Customer  {
    
   
    static async getCustomers(){
        
        try {
            
            var sql = `
                SELECT 
                    customer.*, customergroup.name as customer_group_name
                FROM 
                    customer
                LEFT JOIN customergroup 
                ON customer.customer_group_id = customergroup.id
                WHERE customer.customer_group_id <> "2e9029d0"
                ORDER BY customergroup.name, delivery_order`
            
            const [rows] = await pool.query(sql); 

            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 

    }

    static async getCustomersByGroup(customerGroupId){
        
        try {
            
            var sql = 'SELECT * FROM customer WHERE customer_group_id = ? ORDER BY customer_group_id,delivery_order ';
            
            const [rows] = await pool.query(sql,[customerGroupId]); 

            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        }

    }

    static async getCustomer(customerId){
        
        try {
            
            var sql = 'SELECT * FROM customer WHERE id = ?';
            
            const [rows] = await pool.query(sql,customerId); 

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        }  
    }

    static async createCustomer(customerRawObject) {
            
        try {

            if(!customerRawObject.id){
                customerRawObject.id = createUniqueID();
            }

            if(!customerRawObject.created_at){
                customerRawObject.created_at = new Date();
            }
            
            //SQL query to insert new unser
            var sql = `INSERT INTO customer(
                id,
                created_at,
                created_by,
                customer_group_id, 
                delivery_order, 
                name, 
                alias, 
                delivery_days,
                address,
                location,
                latitude, 
                longitude,
                coordinates,
                mobile_phone,
                email,
                rfc,
                municipality,
                state,
                country,
                is_enable) 
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            
            //Inser new customer
            const {
                id,
                created_at,
                created_by,
                customer_group_id, 
                delivery_order, 
                name, 
                alias, 
                delivery_days,
                address,
                location,
                latitude, 
                longitude,
                coordinates,
                mobile_phone,
                email,
                rfc,
                municipality,
                state,
                country,
                is_enable
            } = customerRawObject
            
            const [rows] = await pool.query(sql,[
                id,
                created_at,
                created_by,
                customer_group_id, 
                delivery_order, 
                name, 
                alias, 
                delivery_days,
                address,
                location,
                latitude, 
                longitude,
                coordinates,
                mobile_phone,
                email,
                rfc,
                municipality,
                state,
                country,
                is_enable
            ]);


            return customerRawObject;
    
        } catch (error) {
            throw (error);
        }
    
    }

    static async updateCustomer(modifiedCustomerObject, id){

        try {

            var sql = `UPDATE customer SET
                customer_group_id = IFNULL(?,customer_group_id), 
                rating = IFNULL(?,rating),
                delivery_order = IFNULL(?,delivery_order),
                name = IFNULL(?,name),
                alias = IFNULL(?,alias), 
                delivery_days = IFNULL(?,delivery_days), 
                address = IFNULL(?,address),
                location = IFNULL(?,location), 
                latitude = IFNULL(?,latitude), 
                longitude = IFNULL(?,longitude),
                coordinates = IFNULL(?,coordinates),
                mobile_phone = IFNULL(?,mobile_phone), 
                email = IFNULL(?,email), 
                rfc = IFNULL(?,rfc), 
                municipality = IFNULL(?,municipality), 
                state = IFNULL(?,state), 
                country = IFNULL(?,country),
                is_enable = IFNULL(?,is_enable)
                WHERE id = ?`;

            var sqlConsult = 'SELECT * FROM customer WHERE id = ?';


            const {
                customer_group_id,
                rating,
                delivery_order, 
                name, 
                alias, 
                delivery_days,
                address,
                location,
                latitute,
                longitude,
                coordinates,
                mobile_phone,
                email,
                rfc,
                municipality,
                state,
                country,
                is_enable
            } = modifiedCustomerObject

            const [result] = await pool.query(sql, [
                customer_group_id,
                rating, 
                delivery_order, 
                name, 
                alias, 
                delivery_days,
                address,
                location,
                latitute,
                longitude,
                coordinates,
                mobile_phone,
                email,
                rfc,
                municipality,
                state,
                country,
                is_enable, id
            ]);
           
            if(result.affectedRows === 0) throw ("Customer not found");

            let  [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw (error);
        }
    }

    static async deleteCustomer(id){
        
        try {
            var sql = 'DELETE FROM customer WHERE id = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }

    static async getNearestSellPoint(lat, long){

        try {
            
            var sql = 
                `SELECT id,name,alias,customer_group_id,address,coordinates,
                    ST_Distance_Sphere(
                      POINT(?, ?),      
                      coordinates
                    ) as distance
                FROM customer
                
                WHERE 
                coordinates IS NOT NULL
                 
                ORDER BY distance
                LIMIT 5`
                const [rows] = await pool.query(sql,[long,lat]);

                if(rows.length < 1) return null;
            
                return rows; 

        } catch (error) {
            throw(error);
        } 

    }
    
    
}

export { Customer };

