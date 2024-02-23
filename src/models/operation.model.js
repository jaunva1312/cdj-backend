import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'
import moment from 'moment';

class Operation {


    static async getOperationById(id){
        
        try {
            var sql = 'SELECT * FROM operation WHERE id = ?';
            
            const [rows] = await pool.query(sql,[id]); 

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        }  
    }

    static async createOperation(operationRawObject){

        try{

            //TODO: Uncomment once the app doesn't need to generate IDs and dates
            //operationRawObject.id = createUniqueID();
            //operationRawObject.created_at =  new Date().toISOString().slice(0, 19).replace('T', ' ');
            //operationRawObject.date = moment().format('YYYY/MM/DD');
            
            var sql = `INSERT INTO Operation(
                id,  
                created_at,
                date,
                created_by, 
                customer_group_id, 
                credit, 
                balance, 
                subtotal, 
                total) 
                VALUES(?,?,?,?,?,?,?,?,?)`;

            const {
                id, 
                created_at,
                date, 
                created_by, 
                customer_group_id, 
                credit, 
                balance,
                subtotal,
                total
            } = operationRawObject
        
            const [rows] = await pool.query(sql,[
                id, 
                created_at,
                date, 
                created_by, 
                customer_group_id, 
                credit, 
                balance,
                subtotal,
                total
            ]);

            return operationRawObject;
            



        }catch(error){
            throw(error);
        }
    }

    static async updateOperation(operationObject, id){

        try {

            var sql = `UPDATE operation SET 
                customer_group_id = IFNULL(?,customer_group_id), 
                credit = IFNULL(?,credit), 
                balance = IFNULL(?,balance), 
                subtotal = IFNULL(?,subtotal), 
                total = IFNULL(?,total)
                WHERE id = ?`;

            var sqlConsult = 'SELECT * FROM operation WHERE id = ?';


            const { 
                customer_group_id, 
                credit, 
                balance,
                subtotal,
                total
            } = operationObject

            const [result] = await pool.query(sql,[
                customer_group_id, 
                credit, 
                balance,
                subtotal,
                total,id
            ]);

    
            if(result.affectedRows == 0) throw ("Operation not found");

            const [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw(error);
        }

    }

    static async deleteOperation(id){
        
        try {
            var sql = 'DELETE FROM Operation WHERE id = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }

    



}

export default Operation