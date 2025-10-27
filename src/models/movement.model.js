import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'
import moment from 'moment';


class Movement  {

    /*

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
    
    */
    
    static async getMovementById(id){
        
        try {
            var sql = 'SELECT * FROM movement WHERE id_movement = ?';
            
            const [rows] = await pool.query(sql,[id]); 

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        }  
    }

    

    static async createMovement(movementRawObject){

        try{

            movementRawObject.id_movement = createUniqueID();
            movementRawObject.createdat =  new Date().toISOString().slice(0, 19).replace('T', ' ');
     
            
            
            var sql = `INSERT INTO movement(
                id_movement,
                createdat,
                user,
                movement_type,
                origin_warehouse,
                destiny_warehouse,
                product,
                quantity) 
                VALUES(?,?,?,?,?,?,?,?)`;

            const {
                id_movement,
                createdat,
                user,
                movement_type,
                origin_warehouse,
                destiny_warehouse,
                product,
                quantity
                
            } = movementRawObject
        
            const [rows] = await pool.query(sql,[
                id_movement,
                createdat,
                user,
                movement_type,
                origin_warehouse,
                destiny_warehouse,
                product,
                quantity

            ]);

            return movementRawObject;
            

        }catch(error){
            throw(error);
        }
    }

    static async updateMovement(movementObject, id){

        try {

            var sql = `UPDATE movement SET 
                movement_type = IFNULL(?,movement_type),
                origin_warehouse = IFNULL(?,origin_warehouse),
                destiny_warehouse = IFNULL(?,destiny_warehouse),
                product = IFNULL(?,product),
                quantity = IFNULL(?,quantity)
                WHERE id_movement = ?`;

            var sqlConsult = 'SELECT * FROM movement WHERE id_movement = ?';


            const { 
                movement_type,
                origin_warehouse,
                destiny_warehouse,
                product,
                quantity
            } = movementObject

            const [result] = await pool.query(sql,[
                movement_type,
                origin_warehouse,
                destiny_warehouse,
                product,
                quantity,id
            ]);

    
            if(result.affectedRows == 0) throw ("Movement not found");

            const [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw(error);
        }

    }

    static async deleteMovement(id){
        
        try {
            var sql = 'DELETE FROM movement WHERE id_movement = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }

    

}

export default Movement