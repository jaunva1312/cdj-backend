import {pool} from '../db.js'
import { Customer } from '../models/customer.model.js';

const customer = {
    
    getCustomers: async function(req,res) {
        try {
            const customers = await Customer.getCustomers();
            res.send(customers);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting customers '  + error
            });
        }
    },

    getCustomersByGroup: async function(req,res) {    
        try {
            const customers = await Customer.getCustomersByGroup(req.params.id);
            res.send(customers);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting customers '  + error
            });
        }
        
    },

    getCustomer: async function(req,res) { 
        try {
            const customer = await Customer.getCustomer(req.params.id);
            res.send(customer);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the customer '  + error
            });
        }

    },

    createCustomer: async function (req,res) {
        try {
            const newCustomer = await Customer.createCustomer(req.body);
            res.send(newCustomer);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong creating the customer '  + error
            });
        } 
    },

    updateCustomer: async function(req,res) { 
        
        try {
            const customer = await Customer.updateCustomer(req.body, req.params.id);
            res.send(customer);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong updating the customer '  + error
            });
        } 

    },

    deleteCustomer: async function(req,res) { 

        try {
            const deleteCustomerRow = await Customer.deleteCustomer(req.params.id);
            
            if(deleteCustomerRow < 1){
                return res.status(404).json({
                    menssage: 'Customer not found'
                });
            }
            res.sendStatus(204);
                      
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong deleting the customer: ' + error
            });
        }
    },
    

    getNearestSellPoint: async function(req,res) {
        try {
            const customers = await Customer.getNearestSellPoint(req.params.lat, req.params.long);
            res.send(customers);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the nearest customers '  + error
            });
        }
    },

    getCustomersWithoutTodaysSale: async function(req,res) {
        try {
            const customers = await Customer.getCustomersWithoutTodaysSale();
            res.send(customers);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting the customers without sales today'  + error
            });
        }
    },
}

export default customer