import {pool} from '../db.js'

class OperationReturn  {

    static async getOperationReturnById(id){
        
        try {
            var sql = 'SELECT * FROM operationreturn WHERE id = ?';
            
            const [rows] = await pool.query(sql,[id]); 

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        }  
    }

    static async createOperationReturn(operationRawObject){

        try{

            //TODO: Uncomment once the app doesn't need to generate IDs and dates
            //operationRawObject.id = createUniqueID();
            //operationRawObject.created_at =  new Date().toISOString().slice(0, 19).replace('T', ' ');
            //operationRawObject.date = moment().format('YYYY/MM/DD');
            
            var sql = `INSERT INTO operationreturn(
                id, 
                operation_id, 
                created_at,
                date,
                created_by, 
                customer_group_id, 
                product_id, 
                product_name, 
                product_category, 
                hot_return,
                cold_return,
                poor_condition_return) 
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;

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
                hot_return,
                cold_return,
                poor_condition_return
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
                hot_return,
                cold_return,
                poor_condition_return
            ]);

            return operationRawObject;
            

        }catch(error){
            throw(error);
        }
    }

    static async updateOperationReturn(operationObject, id){

        try {

            var sql = `UPDATE operationreturn SET
                operation_id = IFNULL(?,operation_id),
                created_at = IFNULL(?,created_at),
                date = IFNULL(?,date),
                created_by = IFNULL(?,created_by), 
                customer_group_id = IFNULL(?,customer_group_id), 
                product_id = IFNULL(?,product_id), 
                product_name = IFNULL(?,product_name), 
                product_category = IFNULL(?,product_category), 
                hot_return = IFNULL(?,hot_return),
                cold_return = IFNULL(?,cold_return),
                poor_condition_return = IFNULL(?,poor_condition_return)
                WHERE id = ?`;

            var sqlConsult = 'SELECT * FROM operationreturn WHERE id = ?';


            const {
                operation_id,
                created_at,
                date,
                created_by,
                customer_group_id, 
                product_id, 
                product_name,
                product_category,
                hot_return,
                cold_return,
                poor_condition_return
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
                hot_return,
                cold_return,
                poor_condition_return,id
            ]);

    
            if(result.affectedRows == 0) throw ("Operation return not found");

            const [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw(error);
        }

    }

    static async deleteOperationReturn(id){
        
        try {
            var sql = 'DELETE FROM operationreturn WHERE id = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }


    static getWeekReturnPorcentage (inputQuantity, returnQuantity){
        
        if(returnQuantity > 0){
            return Number(((returnQuantity/inputQuantity)*100).toFixed(2));
        }
        return 0
    }

    static async getReturnsQuantityByProductName(date,productName){
        
        try {
            var sql = 
                `SELECT SUM(hot_return) AS total_hot_return, SUM(cold_return) AS total_cold_return, SUM(poor_condition_return) AS total_poor_condition_return
                FROM operationreturn
                WHERE date = ? AND product_name = ?`
            
            const [rows] = await pool.query(sql,[
                date, 
                productName
            ]); 

            console.log(rows[0]);

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        }  
    }
}


export default OperationReturn;
