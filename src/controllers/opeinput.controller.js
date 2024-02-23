import OperationInput from '../models/operationinput.model.js'


const OpeInput = {

    getOperationInput: async function(req,res) { 

        try{

            const operationInput = await OperationInput.getOperationInputById(req.params.id);

            if( operationInput == null) return res.status(404).json({
                menssage: 'Operation input not found'

            });

            res.send(operationInput);  

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the operation input: ' + error
            });
        } 
    },
    
    createOperationInput: async function (req,res) {

        try{
            const newOperation = await OperationInput.createOperationInput(req.body);
            res.send(newOperation);

        } catch (error) {
            return res.status(500).json({
                message: 'Something went wrong creating the operation input,' + error
            });
        }
    },

    updateOperationInput: async function(req,res) { 

        try{
            const updatedOperation = await OperationInput.updateOperationInput(req.body, req.params.id);
            res.json(updatedOperation);

        }catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong, ' + error
            });
        }

    },

    deleteOperationInput: async function(req,res) { 

        try{
            
            const deleteOperationInputRow = await OperationInput.deleteOperationInput(req.params.id);

            if(deleteOperationInputRow < 1){
                return res.status(404).json({
                    menssage: 'Operation input not found'
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

export default OpeInput