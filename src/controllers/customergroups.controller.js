import {pool} from '../db.js'

const customerGroup = {
    
    getCustomersGroups: function(req,res) { 
        const [result] =  pool.query('SELECT * FROM dev_cocinadejuan.customergroup');
        res.json(result);
        
    },

    getCustomersGroup: function(req,res) { 
        const [result] =  pool.query('SELECT * FROM dev_cocinadejuan.customergroup WHERE CustomerGroupID ?');
        res.json(result);
        
    },

    createCustomersGroup: function(req,res) { 
        res.send('creando grupo de cliente'); 
    },

    updateCustomersGroup: function(req,res) { 
        res.send('actualizando grupo de cliente'); 
        
    },

    deleteCustomersGroup: function(req,res) { 
        res.send('eliminando grupo de cliente'); 
        
    }
}

export default customerGroup