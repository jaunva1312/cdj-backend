import ProductCategory from '../models/productcategory.model.js'



const productCategory = {
    
    getProductCategories: async function(req,res) {
        try {
            const productCategories = await ProductCategory.getProductCategories();
            res.send(productCategories);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting product categories, '  + error
            });
        }
    },

    
    
    getProductCategory: async function(req,res) { 
        
        try {
           const productCategory = await ProductCategory.getProductCategoryById(req.params.id);

           if(productCategory == null) return res.status(404).json({
                menssage: 'Product category not found'
           });

           res.send(productCategory);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting product category, ' + error
            });
        }  
        

    },

    createProductCategory: async function (req,res) {

        try{
            const newProductCategory = await ProductCategory.createProductCategory(req.body);
            res.send(newProductCategory);

        }catch (error) {
            return res.status(500).json({
                message: 'Something went wrong creating the product category, ' + error
            });
        }
    },
    
    

    updateProductCategory: async function(req,res) { 
        
        try {

            const modifiedProductCategory = await ProductCategory.updateProductCategory(req.body, req.params.id);
            res.json(modifiedProductCategory);
            
        } catch (error) {
            return res.status(404).json({
                message: 'Something went wrong updating the product category, ' + error
            });
        }
    },

    deleteProductCategory: async function(req,res) { 

        try {
            
            const deleteProductCategoryRows = await ProductCategory.deleteProductCategory(req.params.id);
            
            if(deleteProductCategoryRows < 1){
                return res.status(404).json({
                    menssage: 'Product category not found'
                });
            }

            res.sendStatus(204);
            
                     
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong deleting the product category, ' + error
            });
        }
    }
}

export default productCategory