import Movement from '../models/movement.model.js'



const movement = {
    
    /*
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

    */
    
    
    getMovement: async function(req,res) { 
        
        try {
           const movement = await Movement.getMovementById(req.params.id);

           if(movement == null) return res.status(404).json({
                menssage: 'Movement not found'
           });

           res.send(movement);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting movement, ' + error
            });
        }  
        

    },

    createMovement: async function (req,res) {

        try{
            const newMovement = await Movement.createMovement(req.body);
            res.send(newMovement);

        }catch (error) {
            return res.status(500).json({
                message: 'Something went wrong creating the movement, ' + error
            });
        }
    },
    
    

    updateMovement: async function(req,res) { 
        
        try {

            const modifiedMovement = await Movement.updateMovement(req.body, req.params.id);
            res.json(modifiedMovement);
            
        } catch (error) {
            return res.status(404).json({
                message: 'Something went wrong updating the movement, ' + error
            });
        }
    },

    deleteMovement: async function(req,res) { 

        try {
            
            const deleteMovementRows = await Movement.deleteMovement(req.params.id);
            
            if(deleteMovementRows < 1){
                return res.status(404).json({
                    menssage: 'Movement not found'
                });
            }

            res.sendStatus(204);
            
                     
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong deleting the movement, ' + error
            });
        }
    }
}

export default movement