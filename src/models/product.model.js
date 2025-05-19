import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'
import moment from 'moment';

class Product  {

    static async getProducts(isForRouteSales){

        
        
        try {

            if(isForRouteSales != null){
                var sql = `
                    SELECT 
                        product.*, product_group.product_group_name, product_category.product_category_name, supplier.supplier_name 
                    FROM 
                        product
                    LEFT JOIN product_group 
                    ON product.id_product_group = product_group.id_product_group
                    LEFT JOIN product_category
                    ON product.id_product_category = product_category.id_product_category
                    LEFT JOIN supplier
                    ON product.id_supplier = supplier.id_supplier
                    WHERE
                        is_available
                        is_for_route_sales = ?
                    ORDER BY view_order`;
    
            }
            else{
                var sql = `SELECT product.*, product_group.product_group_name, product_category.product_category_name, supplier.supplier_name FROM product
                    LEFT JOIN product_group 
                    ON product.id_product_group = product_group.id_product_group
                    LEFT JOIN product_category
                    ON product.id_product_category = product_category.id_product_category
                    LEFT JOIN supplier
                    ON product.id_supplier = supplier.id_supplier
                    WHERE
                        is_available
                    ORDER BY view_order`;
            }
            
            
            
            const [rows] = await pool.query(sql,[isForRouteSales]); 

            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 

    }
    
    
    static async getProductById(id){

        try {
            var sql = `SELECT product.*, product_group.product_group_name, product_category.product_category_name, supplier.supplier_name FROM product
                LEFT JOIN product_group 
                ON product.id_product_group = product_group.id_product_group
                LEFT JOIN product_category
                ON product.id_product_category = product_category.id_product_category
                LEFT JOIN supplier
                ON product.id_supplier = supplier.id_supplier 
                WHERE product.id_product = ?`;
            
            const [rows] = await pool.query(sql,[id]); 

            if(rows.length < 1) return null;
            
            return this.casProductModel(rows[0]);  

        } catch (error) {
            throw(error);
        }  
    }

    static async createProduct(productRawObject){

        

        try{

            productRawObject.id_product = createUniqueID();
            
            var sql = `INSERT INTO product(
                id_product,
                view_order,
                name,
                short_name,
                id_product_category,
                id_product_group,
                price, 
                public_price,
                cost,
                id_supplier,
                images, 
                is_available,
                is_for_route_sales,
                is_for_public_sales) 
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            const {
                id_product,
                view_order,
                name,
                short_name,
                id_product_category,
                id_product_group,
                price, 
                public_price,
                cost,
                id_supplier,
                images, 
                is_available,
                is_for_route_sales,
                is_for_public_sales
            } = productRawObject
        
            const [rows] = await pool.query(sql,[
                id_product,
                view_order,
                name,
                short_name,
                id_product_category,
                id_product_group,
                price, 
                public_price,
                cost,
                id_supplier,
                images, 
                is_available,
                is_for_route_sales,
                is_for_public_sales
            ]);

            return productRawObject;
            

        }catch(error){
            throw(error);
        }
    }

    static async updateProduct(productObject, id){

        try {

            var sql = `UPDATE product SET 
                view_order = IFNULL(?,view_order), 
                name = IFNULL(?,name), 
                short_name = IFNULL(?,short_name), 
                id_product_category = IFNULL(?,id_product_category),
                id_product_group = IFNULL(?,id_product_group),
                price = IFNULL(?,price),
                public_price = IFNULL(?,public_price),
                cost = IFNULL(?,cost),
                id_supplier = IFNULL(?,id_supplier),
                images = IFNULL(?,images),
                is_available = IFNULL(?,is_available),
                is_for_route_sales = IFNULL(?,is_for_route_sales),
                is_for_public_sales = IFNULL(?,is_for_public_sales)                
                WHERE id_product = ?`;

            var sqlConsult = 'SELECT * FROM product WHERE id_product = ?';


            let { 
                view_order,
                name,
                short_name,
                id_product_category,
                id_product_group,
                price, 
                public_price,
                cost,
                id_supplier,
                images, 
                is_available,
                is_for_route_sales,
                is_for_public_sales
            } = productObject

            if(productObject.images && productObject.images != undefined){
                productObject.images.toString();
            }

            //console.log(images);

            const [result] = await pool.query(sql,[
                view_order,
                name,
                short_name,
                id_product_category,
                id_product_group,
                price, 
                public_price,
                cost,
                id_supplier,
                images,
                is_available,
                is_for_route_sales,
                is_for_public_sales,id
            ]);

    
            if(result.affectedRows == 0) throw ("Product not found");

            const [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw(error);
        }

    }

    static async deleteProduct(id){
        
        try {
            var sql = 'DELETE FROM product WHERE id_product = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }

    static casProductModel(rawProductObject){

        //Convert images property to an array
        var newProductObject = rawProductObject;
    
        
        if(Array.isArray(rawProductObject.images)){
            newProductObject.images = rawProductObject.images;
        }else{
            newProductObject.images = rawProductObject.images.split(",");
        }



        return newProductObject;

    }

    

}

export default Product