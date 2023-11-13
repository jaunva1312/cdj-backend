import {pool} from '../db.js'


const OpeInput = {

    getOperationInput: async function(req,res) { 
        
        try {
            var sql = 'SELECT * FROM OperationInput WHERE OperationInputID = ?';
            const [rows] = await pool.query(sql,[req.params.id]); 

            if(rows.length < 1) return res.status(404).json({
                menssage: 'Operation Input not found'

            });
            res.send(rows[0]);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }  

    },
    
    createOperationInput: async function (req,res) {

        var sql = `INSERT INTO OperationInput(
           OperationInputID, 
           OperationID, 
           CreatedAt,
           Date,
           CreatedBy, 
           CustomerGroupID, 
           ProductID, 
           ProductName, 
           ProductCategory, 
           Quantity) 
           VALUES(?,?,?,?,?,?,?,?,?,?)`;
        try {
            const {
                OperationInputID, 
                OperationID, 
                CreatedAt,
                Date, 
                CreatedBy, 
                CustomerGroupID, 
                ProductID, 
                ProductName,
                ProductCategory,
                Quantity
            } = req.body
    
            const [rows] = await pool.query(sql,
                [OperationInputID, 
                    OperationID, 
                    CreatedAt,
                    Date, 
                    CreatedBy, 
                    CustomerGroupID, 
                    ProductID, 
                    ProductName,
                    ProductCategory,
                    Quantity]
                );
            res.send({
                message: 'Operation Input created',
                OperationInputID: OperationInputID,
                ProductName: ProductName,
                Quantity: Quantity
            }); 
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }
    },

    updateOperationInput: async function(req,res) { 
        
        var sql = `UPDATE OperationInput SET 
            CreatedAt = IFNULL(?,CreatedAt),
            Date = IFNULL(?,Date),
            CreatedBy = IFNULL(?,CreatedBy), 
            CustomerGroupID = IFNULL(?,CustomerGroupID), 
            ProductID = IFNULL(?,ProductID), 
            ProductName = IFNULL(?,ProductName), 
            ProductCategory = IFNULL(?,ProductCategory), 
            Quantity = IFNULL(?,Quantity)
            WHERE OperationInputID = ?`;

        var sqlConsult = 'SELECT * FROM OperationInput WHERE OperationInputID = ?';

        try {
            const {id} = req.params;
            const { 
                CreatedAt,
                Date, 
                CreatedBy, 
                CustomerGroupID, 
                ProductID, 
                ProductName,
                ProductCategory,
                Quantity
            } = req.body

            const [result] = await pool.query(sql, 
                [CreatedAt,
                    Date, 
                    CreatedBy, 
                    CustomerGroupID, 
                    ProductID, 
                    ProductName,
                    ProductCategory,
                    Quantity,id]);
    
            if(result.affectedRows === 0) return res.status(404).json({
                menssage: 'Operation Input not found'
            });
    
            const [rows] = await pool.query(sqlConsult,[id]);
            res.json(rows[0]);

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }
    },

    deleteOperationInput: async function(req,res) { 
        var sql = 'DELETE FROM OperationInput WHERE OperationInputID = ?'
        try {
            const [result] = await pool.query(sql,[req.params.id]); 

            if(result.affectedRows < 1) return res.status(404).json({
                menssage: 'Operation Input not found'
            });

            res.sendStatus(204); 
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }
    }
}

export default OpeInput