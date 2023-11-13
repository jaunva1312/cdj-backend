import {pool} from '../db.js'


const OpeReturn = {

    getOperationReturn: async function(req,res) { 
        
        try {
            var sql = 'SELECT * FROM OperationReturn WHERE OperationReturnID = ?';
            const [rows] = await pool.query(sql,[req.params.id]); 

            if(rows.length < 1) return res.status(404).json({
                menssage: 'Operation Return not found'

            });
            res.send(rows[0]);  
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }  

    },
    
    createOperationReturn: async function (req,res) {

        var sql = `INSERT INTO OperationReturn(
           OperationReturnID, 
           OperationID, 
           CreatedAt,
           Date,
           CreatedBy, 
           CustomerGroupID, 
           ProductID, 
           ProductName, 
           ProductCategory, 
           HotReturn,
           ColdReturn,
           PoorConditionReturn) 
           VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;
        try {
            const {
                OperationReturnID, 
                OperationID, 
                CreatedAt,
                Date, 
                CreatedBy, 
                CustomerGroupID, 
                ProductID, 
                ProductName,
                ProductCategory,
                HotReturn,
                ColdReturn,
                PoorConditionReturn
            } = req.body
    
            const [rows] = await pool.query(sql,
                [OperationReturnID, 
                    OperationID, 
                    CreatedAt,
                    Date, 
                    CreatedBy, 
                    CustomerGroupID, 
                    ProductID, 
                    ProductName,
                    ProductCategory,
                    HotReturn,
                    ColdReturn,
                    PoorConditionReturn]
                );
            res.send({
                message: 'Operation Return created',
                OperationReturnID: OperationReturnID,
                ProductName: ProductName,
                HotReturn: HotReturn,
                ColdReturn: ColdReturn,
                PoorConditionReturn: PoorConditionReturn
            }); 
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong:' + error
            });
        }
    },

    updateOperationReturn: async function(req,res) { 
        
        var sql = `UPDATE OperationReturn SET 
            CreatedAt = IFNULL(?,CreatedAt),
            Date = IFNULL(?,Date),
            CreatedBy = IFNULL(?,CreatedBy), 
            CustomerGroupID = IFNULL(?,CustomerGroupID), 
            ProductID = IFNULL(?,ProductID), 
            ProductName = IFNULL(?,ProductName), 
            ProductCategory = IFNULL(?,ProductCategory), 
            HotReturn = IFNULL(?,HotReturn),
            ColdReturn = IFNULL(?,ColdReturn),
            PoorConditionReturn = IFNULL(?,PoorConditionReturn)
            WHERE OperationReturnID = ?`;

        var sqlConsult = 'SELECT * FROM OperationReturn WHERE OperationReturnID = ?';

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
                HotReturn,
                ColdReturn,
                PoorConditionReturn
            } = req.body

            const [result] = await pool.query(sql, 
                [CreatedAt,
                    Date, 
                    CreatedBy, 
                    CustomerGroupID, 
                    ProductID, 
                    ProductName,
                    ProductCategory,
                    HotReturn,
                    ColdReturn,
                    PoorConditionReturn,id]);
    
            if(result.affectedRows === 0) return res.status(404).json({
                menssage: 'Operation Return not found'
            });
    
            const [rows] = await pool.query(sqlConsult,[id]);
            res.json(rows[0]);

        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong: ' + error
            });
        }
    },

    deleteOperationReturn: async function(req,res) { 
        var sql = 'DELETE FROM OperationReturn WHERE OperationReturnID = ?'
        try {
            const [result] = await pool.query(sql,[req.params.id]); 

            if(result.affectedRows < 1) return res.status(404).json({
                menssage: 'Operation Return not found'
            });

            res.sendStatus(204); 
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong: ' + error
            });
        }
    }
}

export default OpeReturn