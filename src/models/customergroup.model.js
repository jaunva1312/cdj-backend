import {pool} from '../db.js'
import {createUniqueID} from '../libs/dataBase.js'

class CustomerGroup  {
    
   
    static async getCustomersGroups(){
        
        try {
            
            var sql = `SELECT * FROM customergroup ORDER BY view_order`
            
            const [rows] = await pool.query(sql); 

            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 

    }

    
    static async getCustomerGroup(customerGroupId){
        
        try {
            
            var sql = 'SELECT * FROM customergroup WHERE id = ?';
            
            const [rows] = await pool.query(sql,[customerGroupId]); 

            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        }

    }

    static async createCustomerGroup(customerGroupRawObject) {

        try {

            if(!customerGroupRawObject.id){
                customerGroupRawObject.id = createUniqueID();
            }

            
            //SQL query to insert new unser
            var sql = `INSERT INTO customergroup(
                id,
                name,
                short_name,
                view_order, 
                color) 
                VALUES(?,?,?,?,?)`;

            //Inser new customer
            const {
                id,
                name,
                short_name, 
                view_order, 
                color
            } = customerGroupRawObject
            
            const [rows] = await pool.query(sql,[
                id,
                name,
                short_name,
                view_order, 
                color
            ]);


            return customerGroupRawObject;
    
        } catch (error) {
            throw (error);
        }
    
    }

    static async updateCustomerGroup(modifiedCustomerGroupObject, customerGroupId){

        try {

            var sql = `UPDATE customergroup SET
                name = IFNULL(?,name),
                short_name = IFNULL(?,short_name),
                view_order = IFNULL(?,view_order), 
                color = IFNULL(?,color)
                WHERE id = ?`;

            var sqlConsult = 'SELECT * FROM customergroup WHERE id = ?';


            const {
                name,
                short_name, 
                view_order, 
                color
            } = modifiedCustomerGroupObject

            const [result] = await pool.query(sql, [
                name,
                short_name, 
                view_order, 
                color, customerGroupId
            ]);
           
            if(result.affectedRows === 0) throw ("Customer group not found");

            let  [rows] = await pool.query(sqlConsult,[customerGroupId]);

            return rows[0];

        } catch (error) {
            throw (error);
        }
    }

    static async deleteCustomerGroup(id){
        
        try {
            var sql = 'DELETE FROM customergroup WHERE id = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }
   
    
}

export { CustomerGroup };

