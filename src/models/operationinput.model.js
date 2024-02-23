import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'
import moment from 'moment';

class OperationInput {


    static async getOperationInputById(id){
        
        try {
            var sql = 'SELECT * FROM operationinput WHERE id = ?';
            
            const [rows] = await pool.query(sql,[id]); 

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        }  
    }

    static async createOperationInput(operationRawObject){

        try{

            //TODO: Uncomment once the app doesn't need to generate IDs and dates
            //operationRawObject.id = createUniqueID();
            //operationRawObject.created_at =  new Date().toISOString().slice(0, 19).replace('T', ' ');
            //operationRawObject.date = moment().format('YYYY/MM/DD');
            
            var sql = `INSERT INTO operationinput(
                id,  
                operation_id,
                created_at,
                date,
                created_by, 
                customer_group_id, 
                product_id, 
                product_name, 
                product_category, 
                quantity) 
                VALUES(?,?,?,?,?,?,?,?,?,?)`;

            const {
                id,
                operation_id, 
                created_at,
                date, 
                created_by, 
                customer_group_id, 
                product_id, 
                product_name,
                product_category,
                quantity
            } = operationRawObject
        
            const [rows] = await pool.query(sql,[
                id,
                operation_id,
                created_at,
                date, 
                created_by, 
                customer_group_id, 
                product_id, 
                product_name,
                product_category,
                quantity
            ]);

            return operationRawObject;
            

        }catch(error){
            throw(error);
        }
    }

    static async updateOperationInput(operationObject, id){

        try {

            var sql = `UPDATE operationinput SET
                operation_id = IFNULL(?,operation_id),
                created_at = IFNULL(?,created_at),
                date = IFNULL(?,date),
                created_by = IFNULL(?,created_by), 
                customer_group_id = IFNULL(?,customer_group_id), 
                product_id = IFNULL(?,product_id), 
                product_name = IFNULL(?,product_name), 
                product_category = IFNULL(?,product_category), 
                quantity = IFNULL(?,quantity)
                WHERE id = ?`;

            var sqlConsult = 'SELECT * FROM operationinput WHERE id = ?';


            const {
                operation_id,
                created_at,
                date,
                created_by,
                customer_group_id, 
                product_id, 
                product_name,
                product_category,
                quantity
            } = operationObject

            const [result] = await pool.query(sql,[
                operation_id,
                created_at,
                date,
                created_by,
                customer_group_id, 
                product_id, 
                product_name,
                product_category,
                quantity,id
            ]);

    
            if(result.affectedRows == 0) throw ("Operation input not found");

            const [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw(error);
        }

    }

    static async deleteOperationInput(id){
        
        try {
            var sql = 'DELETE FROM operationinput WHERE id = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }

    



}

export default OperationInput