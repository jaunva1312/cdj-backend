import ProductGroup from '../models/productgroup.model.js'



const productGroup = {
    
    getProductGroups: async function(req,res) {
        try {
            const productGroups = await ProductGroup.getProductGroups();
            res.send(productGroups);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting product groups, '  + error
            });
        }
    },

    
    
    getProductGroup: async function(req,res) { 
        
        try {
           const productGroup = await ProductGroup.getProductGroupById(req.params.id);

           if(productGroup == null) return res.status(404).json({
                menssage: 'Product group not found'
           });

           res.send(productGroup);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting product group, ' + error
            });
        }  
        

    },

    createProductGroup: async function (req,res) {

        try{
            const newProductGroup = await ProductGroup.createProductGroup(req.body);
            res.send(newProductGroup);

        }catch (error) {
            return res.status(500).json({
                message: 'Something went wrong creating the product group, ' + error
            });
        }
    },
    
    

    updateProductGroup: async function(req,res) { 
        
        try {

            const modifiedProductGroup = await ProductGroup.updateProductGroup(req.body, req.params.id);
            res.json(modifiedProductGroup);
            
        } catch (error) {
            return res.status(404).json({
                message: 'Something went wrong updating the product group, ' + error
            });
        }
    },

    deleteProductGroup: async function(req,res) { 

        try {
            
            const deleteProductGroupRows = await ProductGroup.deleteProductGroup(req.params.id);
            
            if(deleteProductGroupRows < 1){
                return res.status(404).json({
                    menssage: 'Product group not found'
                });
            }

            res.sendStatus(204);
            
                     
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong deleting the product group, ' + error
            });
        }
    }
}

export default productGroup