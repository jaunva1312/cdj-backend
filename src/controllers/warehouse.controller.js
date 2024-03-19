import Warehouse from '../models/warehouse.model.js'



const warehouse = {
    
    getWarehouses: async function(req,res) {
        try {
            const warehouses = await Warehouse.getWarehouses();
            res.send(warehouses);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting warehouses, '  + error
            });
        }
    },

    
    
    getWarehouse: async function(req,res) { 
        
        try {
           const warehouse = await Warehouse.getWarehouseById(req.params.id);

           if(warehouse == null) return res.status(404).json({
                menssage: 'Warehouse not found'
           });

           res.send(warehouse);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting warehouse, ' + error
            });
        }  
        

    },

    createWarehouse: async function (req,res) {

        try{
            const newWarehouse = await Warehouse.createWarehouse(req.body);
            res.send(newWarehouse);

        }catch (error) {
            return res.status(500).json({
                message: 'Something went wrong creating the warehouse, ' + error
            });
        }
    },
    
    

    updateWarehouse: async function(req,res) { 
        
        try {

            const modifiedWarehouse = await Warehouse.updateWarehouse(req.body, req.params.id);
            res.json(modifiedWarehouse);
            
        } catch (error) {
            return res.status(404).json({
                message: 'Something went wrong updating the warehouse, ' + error
            });
        }
    },

    deleteWarehouse: async function(req,res) { 

        try {
            
            const deleteWarehouseRows = await Warehouse.deleteWarehouse(req.params.id);
            
            if(deleteWarehouseRows < 1){
                return res.status(404).json({
                    menssage: 'Warehouse not found'
                });
            }

            res.sendStatus(204);
            
                     
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong deleting the warehouse, ' + error
            });
        }
    }
}

export default warehouse