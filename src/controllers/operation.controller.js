import {pool} from '../db.js'


const Operation = {

    //getReturn

    getOperation: async function(req,res) { 
        
        try {
            var sql = 'SELECT * FROM Operation WHERE OperationID = ?';
            const [rows] = await pool.query(sql,[req.params.id]); 

            if(rows.length < 1) return res.status(404).json({
                menssage: 'Operation not found'

            });
            res.send(rows[0]);  
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }  

    },
    
    createOperation: async function (req,res) {

        var sql = `INSERT INTO Operation(
           OperationID,  
           CreatedAt,
           Date,
           CreatedBy, 
           CustomerGroupID, 
           Credit, 
           Balance, 
           Subtotal, 
           Total) 
           VALUES(?,?,?,?,?,?,?,?,?)`;
        try {
            const {
                OperationID, 
                CreatedAt,
                Date, 
                CreatedBy, 
                CustomerGroupID, 
                Credit, 
                Balance,
                Subtotal,
                Total
            } = req.body
    
            const [rows] = await pool.query(sql,
                [OperationID, 
                    CreatedAt,
                    Date, 
                    CreatedBy, 
                    CustomerGroupID, 
                    Credit, 
                    Balance,
                    Subtotal,
                    Total]
                );
            res.send({
                message: 'Operation created',
                OperationID: OperationID,
                CustomerGroupID: CustomerGroupID,
                Credit: Credit,
                Balance: Balance,
                Subtotal: Subtotal,
                Total: Total
            }); 
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong:' + error
            });
        }
    },

    updateOperation: async function(req,res) { 
        
        var sql = `UPDATE Operation SET 
            CreatedAt = IFNULL(?,CreatedAt),
            Date = IFNULL(?,Date),
            CreatedBy = IFNULL(?,CreatedBy), 
            CustomerGroupID = IFNULL(?,CustomerGroupID), 
            Credit = IFNULL(?,Credit), 
            Balance = IFNULL(?,Balance), 
            Subtotal = IFNULL(?,Subtotal), 
            Total = IFNULL(?,Total)
            WHERE OperationID = ?`;

        var sqlConsult = 'SELECT * FROM Operation WHERE OperationID = ?';

        try {
            const {id} = req.params;
            const { 
                CreatedAt,
                Date, 
                CreatedBy, 
                CustomerGroupID, 
                Credit, 
                Balance,
                Subtotal,
                Total
            } = req.body

            const [result] = await pool.query(sql, 
                [CreatedAt,
                    Date, 
                    CreatedBy, 
                    CustomerGroupID, 
                    Credit, 
                    Balance,
                    Subtotal,
                    Total,id]);
    
            if(result.affectedRows === 0) return res.status(404).json({
                menssage: 'Operation not found'
            });
    
            const [rows] = await pool.query(sqlConsult,[id]);
            res.json(rows[0]);

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong: ' + error
            });
        }
    },

    deleteOperation: async function(req,res) { 
        var sql = 'DELETE FROM Operation WHERE OperationID = ?'
        try {
            const [result] = await pool.query(sql,[req.params.id]); 

            if(result.affectedRows < 1) return res.status(404).json({
                menssage: 'Operation not found'
            });

            res.sendStatus(204); 
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong: ' + error
            });
        }
    }
}

export default Operation