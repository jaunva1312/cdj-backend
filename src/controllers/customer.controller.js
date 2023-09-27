import {pool} from '../db.js'
import { Customer } from '../models/customer.model.js';

const customer = {
    
    getCustomers: async function(req,res) {
        try {
            var sql = 'SELECT * FROM Customer';
            const [rows] = await pool.query(sql);
            res.json(rows);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }
    },

    getCustomersByGroup: async function(req,res) {    
        try{
            var sql = 'SELECT * FROM Customer WHERE CustomerGroupID = ?';
            const [rows] = await pool.query(sql,[req.params.id]); 
            res.send(rows);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }
        
    },

    getCustomer: async function(req,res) { 
        
        try {
            var sql = 'SELECT * FROM Customer WHERE CustomerID = ?';
            const [rows] = await pool.query(sql,[req.params.id]); 

            if(rows.length < 1) return res.status(404).json({
                menssage: 'Customer not found'

            });
            res.send(rows[0]);  
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }  

    },

    createCustomer: async function (req,res) {

        var sql = `INSERT INTO Customer(
           CustomerID, 
           CreatedAt, 
           CreatedBy, 
           CustomerGroupID, 
           DeliveryOrder, 
           CustomerName, 
           CustomerAlias, 
           DeliveryDays, 
           Address, 
           Location, 
           MobilePhone, 
           Email, 
           RFC, 
           Municipality, 
           State, 
           Country, 
           IsEnable) 
           VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        try {
            const {
                CustomerID, 
                CreatedAt, 
                CreatedBy,
                CustomerGroupID, 
                DeliveryOrder, 
                CustomerName, 
                CustomerAlias, 
                DeliveryDays,
                Address,
                Location,
                MobilePhone,
                Email,
                RFC,
                Municipality,
                State,
                Country,
                IsEnable
            } = req.body
    
            const [rows] = await pool.query(sql,
                [CustomerID, 
                    CreatedAt, 
                    CreatedBy,
                    CustomerGroupID, 
                    DeliveryOrder, 
                    CustomerName, 
                    CustomerAlias, 
                    DeliveryDays,
                    Address,
                    Location,
                    MobilePhone,
                    Email,
                    RFC,
                    Municipality,
                    State,
                    Country,
                    IsEnable]
                );
            res.send({
                message: 'Customer created',
                CustomerID: CustomerID,
                CustomerName: CustomerName,
                CustomerGroupID: CustomerGroupID
            }); 
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }
    },

    updateCustomer: async function(req,res) { 
        
        var sql = `UPDATE Customer SET
            CustomerGroupID = IFNULL(?,CustomerGroupID), 
            DeliveryOrder = IFNULL(?,DeliveryOrder), 
            CustomerName = IFNULL(?,CustomerName), 
            CustomerAlias = IFNULL(?,CustomerAlias), 
            DeliveryDays = IFNULL(?,DeliveryDays), 
            Address = IFNULL(?,Address), 
            Location = IFNULL(?,Location), 
            MobilePhone = IFNULL(?,MobilePhone), 
            Email = IFNULL(?,Email), 
            RFC = IFNULL(?,RFC), 
            Municipality = IFNULL(?,Municipality), 
            State = IFNULL(?,State), 
            Country = IFNULL(?,Country), 
            IsEnable = IFNULL(?,IsEnable)
            WHERE CustomerID = ?`;

        var sqlConsult = 'SELECT * FROM Customer WHERE CustomerID = ?';

        try {
            const {id} = req.params;
            const {
                CustomerGroupID, 
                DeliveryOrder, 
                CustomerName, 
                CustomerAlias, 
                DeliveryDays,
                Address,
                Location,
                MobilePhone,
                Email,
                RFC,
                Municipality,
                State,
                Country,
                IsEnable
            } = req.body

            const [result] = await pool.query(sql, 
                [CustomerGroupID, 
                DeliveryOrder, 
                CustomerName, 
                CustomerAlias, 
                DeliveryDays,
                Address,
                Location,
                MobilePhone,
                Email,
                RFC,
                Municipality,
                State,
                Country,
                IsEnable,id]);
    
            if(result.affectedRows === 0) return res.status(404).json({
                menssage: 'Customer not found'
            });
    
            const [rows] = await pool.query(sqlConsult,[id]);
            res.json(rows[0]);

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }
    },

    deleteCustomer: async function(req,res) { 
        var sql = 'DELETE FROM Customer WHERE CustomerID = ?'
        try {
            const [result] = await pool.query(sql,[req.params.id]); 

            if(result.affectedRows < 1) return res.status(404).json({
                menssage: 'Customer not found'
            });

            res.sendStatus(204); 
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }
    }
}

export default customer