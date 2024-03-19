import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'


class Warehouse  {

    static async getWarehouses(){
        
        try {
            var sql = 'SELECT * FROM warehouse';
            
            const [rows] = await pool.query(sql); 

            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 

    }
    
    
    static async getWarehouseById(id){
        
        try {
            var sql = 'SELECT * FROM warehouse WHERE id_warehouse = ?';
            
            const [rows] = await pool.query(sql,[id]); 

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        }  
    }

    static async createWarehouse(warehouseRawObject){

        try{

            warehouseRawObject.id_warehouse = createUniqueID();
            
            var sql = `INSERT INTO warehouse(
                id_warehouse,
                name,
                description) 
                VALUES(?,?,?)`;

            const {
                id_warehouse,
                name,
                description
                
            } = warehouseRawObject
        
            const [rows] = await pool.query(sql,[
                id_warehouse,
                name,
                description

            ]);

            return warehouseRawObject;
            

        }catch(error){
            throw(error);
        }
    }

    static async updateWarehouse(warehouseObject, id){

        try {

            var sql = `UPDATE warehouse SET 
                name = IFNULL(?,name),
                description = IFNULL(?,description)
                WHERE id_warehouse = ?`;

            var sqlConsult = 'SELECT * FROM warehouse WHERE id_warehouse = ?';


            const { 
                name,
                description
            } = warehouseObject

            const [result] = await pool.query(sql,[
                name,
                description,id
            ]);

    
            if(result.affectedRows == 0) throw ("Warehouse not found");

            const [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw(error);
        }

    }

    static async deleteWarehouse(id){
        
        try {
            var sql = 'DELETE FROM warehouse WHERE id_warehouse = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }

    

}

export default Warehouse