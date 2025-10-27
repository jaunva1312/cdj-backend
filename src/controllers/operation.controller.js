import Operation from '../models/operation.model.js'


const operation = {


    getOperation: async function(req,res) { 

        try {
            
            const operation = await Operation.getOperationById(req.params.id);

            if(operation == null) return res.status(404).json({
                menssage: 'Operation not found'

            });

            res.send(operation);  
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the operation, ' + error
            });
        }

    },
    
    createOperation: async function (req,res) {

        try{
            const newOperation = await Operation.createOperation(req.body);
            res.send(newOperation);

        }catch (error) {
            return res.status(500).json({
                message: 'Something went wrong creating the operation,' + error
            });
        }
    },

    updateOperation: async function(req,res) { 

        try{
            const updatedOPeration = await Operation.updateOperation(req.body, req.params.id);
            res.json(updatedOPeration);

        }catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong, ' + error
            });
        }
    },

    deleteOperation: async function(req,res) { 

        try{
            
            const deleteOperationRows = await Operation.deleteOperation(req.params.id);

            if(deleteOperationRows < 1){
                return res.status(404).json({
                    menssage: 'Operation not found'
                });
            }
            res.sendStatus(204); 

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong: ' + error
            });
        }
    }
}

export default operation