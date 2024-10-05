
import OperationReturn from '../models/opereturn.model.js'


const OpeReturn = {

    getOperationReturn: async function(req,res) { 

        try{

            const operationReturn = await OperationReturn.getOperationReturnById(req.params.id);

            if( operationReturn == null) return res.status(404).json({
                menssage: 'Operation return not found'

            });

            res.send(operationReturn);  

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the operation return: ' + error
            });
        } 
    },
    
    createOperationReturn: async function (req,res) {

        try{
            const newOperation = await OperationReturn.createOperationReturn(req.body);
            res.send(newOperation);

        } catch (error) {
            return res.status(500).json({
                message: 'Something went wrong creating the operation return: ' + error
            });
        }
    },

    updateOperationReturn: async function(req,res) { 

        try{
            const updatedOperation = await OperationReturn.updateOperationReturn(req.body, req.params.id);
            res.json(updatedOperation);

        }catch (error) {
            return res.status(500).json({
                message: 'Something went wrong updating the operation return: ' + error
            });
        }

    },

    deleteOperationReturn: async function(req,res) { 

        try{
            
            const deleteOperationReturnRow = await OperationReturn.deleteOperationReturn(req.params.id);

            if(deleteOperationReturnRow < 1){
                return res.status(404).json({
                    menssage: 'Operation return not found'
                });
            }
            res.sendStatus(204); 

        } catch (error) {
            return res.status(500).json({
                message: 'Something went wrong deleting the operation return: ' + error
            });
        }
        
    }
}

export default OpeReturn