import {pool} from '../db.js'

const customerGroup = {
    
    getCustomersGroups: function(req,res) { 
        const [result] =  pool.query('SELECT * FROM dev_cocinadejuan.customergroup');
        res.json(result);
        
    },

    getCustomersGroup: async function(req,res) { 
        try{
            var sql = 'SELECT * FROM dev_cocinadejuan.customergroup WHERE CustomerGroupID ?';
            const [rows] = await pool.query(sql,[req.params.id]); 

            if(rows.length < 1) return res.status(404).json({
                menssage: 'Customer group not found'

            });
            res.send(rows[0]);

        }catch{(error)
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }
        
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