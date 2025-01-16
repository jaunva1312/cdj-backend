import { CustomerGroup } from '../models/customergroup.model.js';

const customerGroup = {
    
    getCustomersGroups: async function(req,res) {
        try {
            const customersGroups = await CustomerGroup.getCustomersGroups();
            res.send(customersGroups);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting customers groups '  + error
            });
        }
    },


    getCustomerGroup: async function(req,res) { 
        try {
            const customerGroup = await CustomerGroup.getCustomerGroup(req.params.id);
            res.send(customerGroup);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the customer group '  + error
            });
        }

    },

    createCustomerGroup: async function (req,res) {
        try {
            const newCustomerGroup = await CustomerGroup.createCustomerGroup(req.body);
            res.send(newCustomerGroup);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong creating the customer group'  + error
            });
        } 
    },

    updateCustomerGroup: async function(req,res) { 
        
        try {
            const customerGroup = await CustomerGroup.updateCustomerGroup(req.body, req.params.id);
            res.send(customerGroup);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong updating the customer group: '  + error
            });
        } 

    },

    deleteCustomerGroup: async function(req,res) { 

        try {
            const deleteCustomerGroupRow = await CustomerGroup.deleteCustomerGroup(req.params.id);
            
            if(deleteCustomerGroupRow < 1){
                return res.status(404).json({
                    menssage: 'Customer group not found'
                });
            }
            res.sendStatus(204);
                      
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong deleting the customer group: ' + error
            });
        }
    },
    
}

export default customerGroup