import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'


class ProductCategory  {

    static async getProductCategories(){
        
        try {
            var sql = 'SELECT * FROM product_category';
            
            const [rows] = await pool.query(sql); 

            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 

    }
    
    
    static async getProductCategoryById(id){
        
        try {
            var sql = 'SELECT * FROM product_category WHERE id_product_category = ?';
            
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
            
            var sql = `INSERT INTO product_category(
                id_product_category,
                product_category_name) 
                VALUES(?,?)`;

            const {
                id_product_category,
                product_category_name
                
            } = productCategoryRawObject
        
            const [rows] = await pool.query(sql,[
                id_product_category,
                product_category_name
            ]);

            return productCategoryRawObject;
            

        }catch(error){
            throw(error);
        }
    }

    static async updateProductCategory(productCategoryObject, id){

        try {

            var sql = `UPDATE product_category SET 
                product_category_name = IFNULL(?,product_category_name)
                WHERE id_product_category = ?`;

            var sqlConsult = 'SELECT * FROM product_category WHERE id_product_category = ?';


            const { 
                product_category_name,
            } = productCategoryObject

            const [result] = await pool.query(sql,[
                product_category_name,id
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
            var sql = 'DELETE FROM product_category WHERE id_product_category = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }

    

}

export default ProductCategory