import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'


class ProductCategory  {

    static async getProductCategories(){
        
        try {
            var sql = 'SELECT * FROM productcategory';
            
            const [rows] = await pool.query(sql); 

            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 

    }
    
    
    static async getProductCategoryById(id){
        
        try {
            var sql = 'SELECT * FROM productcategory WHERE id_product_category = ?';
            
            const [rows] = await pool.query(sql,[id]); 

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        }  
    }

    static async createProductCategory(productCategoryRawObject){

        try{

            productCategoryRawObject.id_product_category = createUniqueID();
            
            var sql = `INSERT INTO productcategory(
                id_product_category,
                name) 
                VALUES(?,?)`;

            const {
                id_product_category,
                name
                
            } = productCategoryRawObject
        
            const [rows] = await pool.query(sql,[
                id_product_category,
                name
            ]);

            return productCategoryRawObject;
            

        }catch(error){
            throw(error);
        }
    }

    static async updateProductCategory(productCategoryObject, id){

        try {

            var sql = `UPDATE productcategory SET 
                name = IFNULL(?,name)
                WHERE id_product_category= ?`;

            var sqlConsult = 'SELECT * FROM productcategory WHERE id_product_category = ?';


            const { 
                name,
            } = productCategoryObject

            const [result] = await pool.query(sql,[
                name,id
            ]);

    
            if(result.affectedRows == 0) throw ("Product category not found");

            const [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw(error);
        }

    }

    static async deleteProductCategory(id){
        
        try {
            var sql = 'DELETE FROM productcategory WHERE id_product_category = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }

    

}

export default ProductCategory