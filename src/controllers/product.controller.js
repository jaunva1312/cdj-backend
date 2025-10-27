import Product from '../models/product.model.js'



const product = {
    
    getProducts: async function(req,res) {
        try {
            const products = await Product.getProducts(req.query.is_for_route_sales);
            res.send(products);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting products '  + error
            });
        }
    },

    
    
    getProduct: async function(req,res) { 
        
        try {
           const product = await Product.getProductById(req.params.id);

           if(product == null) return res.status(404).json({
                menssage: 'Product not found'
           });

           res.send(product);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting user: ' + error
            });
        }  
        

    },

    createProduct: async function (req,res) {

        try{
            const newProduct = await Product.createProduct(req.body);
            //console.log(newProduct);
            res.send(newProduct);

        }catch (error) {
            return res.status(500).json({
                message: 'Something went wrong creating the product,' + error
            });
        }
    },
    
    

    updateProduct: async function(req,res) { 
        
        try {

            const modifiedProduct = await Product.updateProduct(req.body, req.params.id);
            res.json(modifiedProduct);
            
        } catch (error) {
            return res.status(404).json({
                message: 'Something went wrong updating the product,' + error
            });
        }
    },

    deleteProduct: async function(req,res) { 

        try {
            
            const deleteProductRows = await Product.deleteProduct(req.params.id);
            
            if(deleteProductRows < 1){
                return res.status(404).json({
                    menssage: 'Product not found'
                });
            }

            res.sendStatus(204);
            
                     
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong ' + error
            });
        }
    }
}

export default product