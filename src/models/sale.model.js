import {createUniqueID} from '../libs/dataBase.js'
import SaleDelivery from '../models/saledelivery.model.js'
import {pool} from '../db.js'

class Sale  {

    static async getSales(start_date, end_date, customer_group_id){

        var saleObjects;

        try {
            
            var sql =
            `
            SELECT 
                    sale.*, 
                    customergroup.name as customer_group_name,
                    customer.name as customer_name

                FROM
                    sale

                LEFT JOIN 
                    customer 
                ON 
                    sale.customer_id = customer.id

                LEFT JOIN 
                    customergroup 
                ON 
                    sale.customer_group_id = customergroup.id
                WHERE
                    DATE(sale.created_at) BETWEEN ? AND ?
                    AND sale.customer_group_id = ?
                
                ORDER BY sale.created_at DESC;
            `;

            

            const [rows] = await pool.query(sql,[
                start_date, 
                end_date,
                customer_group_id,
   
            ]); 


            if(rows.length < 1) return null;
            
            saleObjects = rows;
            for await (let obj of saleObjects){
               obj.sales_deliveries = await SaleDelivery.getSalesDeliveries(obj.id_sale);
            }

            return saleObjects;
            

        } catch (error) {
            throw(error);
        } 

    }

    static async getSaleById(id){
        
        try {
            var saleObj;
            var sql = 'SELECT * FROM sale WHERE id_sale = ?';
                        
            const [rows] = await pool.query(sql,[id]); 

            if(rows.length < 1) return null;

            saleObj = rows[0];
            saleObj.sales_deliveries = await SaleDelivery.getSalesDeliveries(saleObj.id_sale);
            
            return saleObj;

        } catch (error) {
            throw(error);
        }  
    }

    static async createSale(saleRawObject){

        try{

            var sql = `INSERT INTO sale(
                id_sale,  
                created_at,
                created_by, 
                customer_id,
                customer_group_id,
                ammount, 
                payment_method,
                sale_type,
                sale_status) 
                VALUES(?,?,?,?,?,?,?,?,?)`;

            const {
                id_sale,
                created_at,
                created_by, 
                customer_id,
                customer_group_id,
                ammount, 
                payment_method,
                sale_type,
                sale_status
            } = saleRawObject
        
            const [rows] = await pool.query(sql,[
                id_sale,
                created_at,
                created_by,
                customer_id,
                customer_group_id,
                ammount, 
                payment_method,
                sale_type,
                sale_status
            ]);

            return saleRawObject;
            

        }catch(error){
            throw(error);
        }
    }

    static async updateSale(saleObject, id){

        try {

            var sql = `UPDATE sale SET
                customer_id = IFNULL(?,customer_id),
                customer_group_id = IFNULL(?,customer_group_id), 
                ammount = IFNULL(?,ammount), 
                payment_method = IFNULL(?,payment_method), 
                sale_type = IFNULL(?,sale_type), 
                sale_status = IFNULL(?,sale_status)
                WHERE id_sale = ?`;

            var sqlConsult = 'SELECT * FROM sale WHERE id_sale = ?';


            const {
                customer_id,
                customer_group_id,
                ammount, 
                payment_method,
                sale_type,
                sale_status
            } = saleObject

            const [result] = await pool.query(sql,[
                customer_id,
                customer_group_id,
                ammount, 
                payment_method,
                sale_type,
                sale_status,id
            ]);

    
            if(result.affectedRows == 0) throw ("Sale not found");

            const [rows] = await pool.query(sqlConsult,[id]);

            return rows[0];

        } catch (error) {
            throw(error);
        }

    }

    static async deleteSale(id){
        
        try {
            var sql = 'DELETE FROM sale WHERE id_sale = ?'
            const [result] = await pool.query(sql,[id]); 

            return result.affectedRows;

        } catch (error) {
            throw (error);
        }
    }

    static async getSalesByDateAndProduct(startDate, endDate, productName){

        try {
            
            var sql = 
            `SELECT 
	            i.product_name, 
                SUM(IFNULL(i.quantity, 0)) AS total_quantity,
                (SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))) AS total_returns,
                (SUM(IFNULL(i.quantity, 0)) - 
                (SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0)))) AS total
            FROM 
                operationinput i
            LEFT JOIN 
                operationreturn r 
            ON 
                i.operation_id = r.operation_id
                AND i.customer_group_id = r.customer_group_id
                AND i.product_id = r.product_id
            WHERE 
                i.date BETWEEN ? AND ?
                AND i.product_name = ?
            GROUP BY 
                i.product_id;`
            
            const [rows] = await pool.query(sql,[
                startDate, 
                endDate,
                productName
            ]); 

            console.log(rows[0]);

            if(rows.length < 1) return null;
            
            return rows[0];  

        } catch (error) {
            throw(error);
        } 

    }

    static async getSalesSumaryByCustomerGroudId(startDate, endDate, customerGroupId){

        
        var sales = {
            totalEntries: 0,
            totalReturns: 0,
            returnPocentage: 0,
            salesAmount: 0
        }
        
        try {
            
            var sql = 
            `SELECT 

                g.name AS route,
                i.product_name,
                CAST(SUM(IFNULL(i.quantity, 0))as SIGNED) AS total_entries,
                CAST((SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))) as SIGNED) AS total_returns,
                CAST((SUM(IFNULL(i.quantity, 0)) - 
                (SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0)))) as SIGNED) AS total,
                (IFNULL(p.price, 0)) AS price,
                (p.price * (SUM(IFNULL(i.quantity, 0)) - 
                (SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))))) AS ammount


            FROM 
                operationinput i
            LEFT JOIN 
                operationreturn r 
            ON 

                i.operation_id = r.operation_id
                AND i.customer_group_id = r.customer_group_id
                AND i.product_id = r.product_id

            LEFT JOIN 
                customergroup g
            ON 
                i.customer_group_id = g.id
            LEFT JOIN 
                product p
            ON 
                i.product_id = p.id_product
            WHERE 
                i.date BETWEEN ? AND ?
                AND i.customer_group_id = ?
            GROUP BY 
                i.customer_group_id,
                i.product_id,
                i.product_name,
                p.price
                
            ORDER BY
                g.name;`
            
            const [rows] = await pool.query(sql,[
                startDate, 
                endDate,
                customerGroupId
            ]); 

            if(rows.length < 1) return null;

            rows.forEach((row) => {
                                
                sales.totalEntries = sales.totalEntries + row.total_entries;
                sales.totalReturns = sales.totalReturns + row.total_returns;
                sales.salesAmount = sales.salesAmount + row.ammount;

            });

            sales.returnPocentage = sales.totalReturns/sales.totalEntries;
            
            return sales;  

        } catch (error) {
            throw(error);
        } 
    }

    static async getSalesDetailsByCustomeId(startDate, endDate, customerGroupId, productName){
        
        console.log(productName);
        try {
            if(productName != ''){

                var sql = 
                    `SELECT 

                        g.name AS route,
                        i.product_name,
                        CAST(SUM(IFNULL(i.quantity, 0))as SIGNED) AS total_entries,
                        CAST((SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))) as SIGNED) AS total_returns,
                        CAST((SUM(IFNULL(i.quantity, 0)) - 
                        (SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0)))) as SIGNED) AS total,
                        (IFNULL(p.price, 0)) AS price,
                        (p.price * (SUM(IFNULL(i.quantity, 0)) - 
                        (SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))))) AS ammount


                    FROM 
                        operationinput i
                    LEFT JOIN 
                        operationreturn r 
                    ON 

                        i.operation_id = r.operation_id
                        AND i.customer_group_id = r.customer_group_id
                        AND i.product_id = r.product_id

                    LEFT JOIN 
                        customergroup g
                    ON 
                        i.customer_group_id = g.id
                    LEFT JOIN 
                        product p
                    ON 
                        i.product_id = p.id_product
                    WHERE 
                        i.date BETWEEN ? AND ?
                        AND i.customer_group_id = ?
                        AND i.product_name = ?
                    GROUP BY 
                        i.customer_group_id,
                        i.product_id,
                        i.product_name,
                        p.price
                        
                    ORDER BY
                        g.name,
                        p.view_order;`
            }
            else{
                var sql = 
                    `SELECT 

                        g.name AS route,
                        i.product_name,
                        CAST(SUM(IFNULL(i.quantity, 0))as SIGNED) AS total_entries,
                        CAST((SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))) as SIGNED) AS total_returns,
                        CAST((SUM(IFNULL(i.quantity, 0)) - 
                        (SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0)))) as SIGNED) AS total,
                        (IFNULL(p.price, 0)) AS price,
                        (p.price * (SUM(IFNULL(i.quantity, 0)) - 
                        (SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))))) AS ammount


                    FROM 
                        operationinput i
                    LEFT JOIN 
                        operationreturn r 
                    ON 

                        i.operation_id = r.operation_id
                        AND i.customer_group_id = r.customer_group_id
                        AND i.product_id = r.product_id

                    LEFT JOIN 
                        customergroup g
                    ON 
                        i.customer_group_id = g.id
                    LEFT JOIN 
                        product p
                    ON 
                        i.product_id = p.id_product
                    WHERE 
                        i.date BETWEEN ? AND ?
                        AND i.customer_group_id = ?
                    GROUP BY 
                        i.customer_group_id,
                        i.product_id,
                        i.product_name,
                        p.price
                        
                    ORDER BY
                        g.name,
                        p.view_order;`
            }
            
            
            const [rows] = await pool.query(sql,[
                startDate, 
                endDate,
                customerGroupId,
                productName
            ]);


            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 
    }

    static async getSalesByWeek(year, customerGroupName){
        
        try {
            
            var sql = 
                `
                SELECT 
                    customergroup.name as customer_group_name,
                    YEAR(operation.date) as year,
                    WEEK(operation.created_at) as week, 
                    CAST(SUM(IFNULL(subtotal, 0))as SIGNED) as sales

                FROM
                    operation 

                LEFT JOIN 
                    customergroup 
                ON 
                    operation.customer_group_id = customergroup.id
                WHERE
                    YEAR(operation.date) = ? AND customergroup.name = ?
                GROUP BY 
                    customer_group_id, year, week  
                ORDER BY 
                    year, week DESC;

                `
            
            const [rows] = await pool.query(sql,[
                year, 
                customerGroupName
            ]);


            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 
    }

    
    
    
    

    

}

export default Sale