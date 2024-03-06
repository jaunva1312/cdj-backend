import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'


class ProductGroup  {

    static async getProductGroups(){
        
        try {
            var sql = 'SELECT * FROM productgroup';
            
            const [rows] = await pool.query(sql); 

            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 

    }
    
    
    static async getProductGroupById(id){
        
        try {
            var sql = 'SELECT * FROM productgroup WHERE id_product_group = ?';
            
            const [rows] = await pool.query(sql,[id]); 

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        }  
    }

    static async createProductGroup(productGroupRawObject){

        try{

            productGroupRawObject.id_product_group = createUniqueID();
            
            var sql = `INSERT INTO productgroup(
                id_product_group,
                name) 
                VALUES(?,?)`;

            const {
                id_product_group,
                name
                
            } = productGroupRawObject
        
            const [rows] = await pool.query(sql,[
                id_product_group,
                name
            ]);

            return productGroupRawObject;
            

        }catch(error){
            throw(error);
        }
    }

    static async updateProductGroup(productGroupObject, id){

        try {

            var sql = `UPDATE productgroup SET 
                name = IFNULL(?,name)
                WHERE id_product_group = ?`;

            var sqlConsult = 'SELECT * FROM productgroup WHERE id_product_group = ?';


            const { 
                name,
            } = productGroupObject

            const [result] = await pool.query(sql,[
                name,id
            ]);

    
            if(result.affectedRows == 0) throw ("Product group not found");

            const [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw(error);
        }

    }

    static async deleteProductGroup(id){
        
        try {
            var sql = 'DELETE FROM productgroup WHERE id_product_group = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }

    

}

export default ProductGroup