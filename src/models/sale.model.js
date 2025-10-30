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

    static async getCustomerLastSales(customer_id, number){
                 
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
                
                sale.customer_id = ?

            ORDER BY sale.created_at DESC
            LIMIT ?;
            `;

            

            const [rows] = await pool.query(sql,[
                customer_id,
                parseInt(number)
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

    static async getSalesDetailsByCustomerId(startDate, endDate, customerGroupId, productName){
        
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

    static async getCustomersPercentageByProduct(productId, startDate, endDate){
        
        try {
        const sql = `
            SELECT 
                cg.id,
                cg.name,
                COUNT(DISTINCT c.id) AS total_customers_in_group,
                COUNT(DISTINCT CASE 
                                WHEN sd.product_id = ? 
                                     AND sd.date BETWEEN ? AND ? THEN c.id
                                ELSE NULL
                            END) AS customers_with_product,
                CAST(
                    (
                        COUNT(DISTINCT CASE 
                                        WHEN sd.product_id = ? 
                                             AND sd.date BETWEEN ? AND ? THEN c.id
                                        ELSE NULL
                                    END) / COUNT(DISTINCT c.id)
                    ) * 100
                AS DECIMAL(5,2)) AS percentage_with_product
            FROM 
                customer c
            JOIN 
                customergroup cg ON c.customer_group_id = cg.id
            LEFT JOIN 
                sale_delivery sd ON c.id = sd.customer_id
            GROUP BY 
                cg.id, cg.name
            ORDER BY
                cg.name;
        `;

            // Los parámetros se repiten porque se usan en ambos CASE
            const params = [productId, startDate, endDate, productId, startDate, endDate];

            const [rows] = await pool.query(sql, params);

            if (rows.length < 1) return null;

            return rows;

        } catch (error) {
            throw error;
        }
    }

    static async getCustomersSalesByProductAndDates(productId, customerGroup, startDate, endDate){
        
        try {
        const sql = `
            SELECT 
                c.id AS customer_id,
                c.delivery_order,
                c.name AS customer_name, 
                c.alias,
                p.name AS product,
                CAST(SUM(sd.quantity) AS UNSIGNED) AS total_quantity

            FROM 
                sale_delivery sd 
            JOIN 
                customer c ON sd.customer_id = c.id 
            JOIN 
                customergroup cg ON c.customer_group_id = cg.id
            JOIN 
                sale s ON sd.sale_id = s.id_sale
            JOIN 
                product p ON sd.product_id = p.id_product
            WHERE 
                sd.product_id = ?
                AND s.customer_group_id = ?
                AND sd.date BETWEEN ? AND ? 
                

            GROUP BY c.customer_group_id, c.id, c.name, sd.product_id 
                
            ORDER BY c.delivery_order ASC
        `;

            // Los parámetros se repiten porque se usan en ambos CASE
            const params = [productId, customerGroup, startDate, endDate];

            const [rows] = await pool.query(sql, params);

            if (rows.length < 1) return null;

            return rows;

        } catch (error) {
            throw error;
        }
    }

    static async getCustomersWithoutProduct(productId, startDate, endDate)
    {
        try {
            // Si hay múltiples grupos, los convertimos en placeholders para IN (...)
            let groupFilter = '';
            let params = [productId, startDate, endDate];

            if (customerGroupIds && customerGroupIds.length > 0) {
                const placeholders = customerGroupIds.map(() => '?').join(',');
                groupFilter = `AND cg.id IN (${placeholders})`;
                params = params.concat(customerGroupIds);
            }

            const sql = `
                SELECT 
                    cg.id AS customer_group_id,
                    cg.name AS customer_group_name,
                    c.delivery_order,
                    c.id AS customer_id,
                    c.name AS customer_name
                FROM 
                    customer c
                JOIN 
                    customergroup cg ON c.customer_group_id = cg.id
                WHERE 
                    NOT EXISTS (
                        SELECT 1
                        FROM sale_delivery sd
                        WHERE sd.customer_id = c.id
                        AND sd.product_id = ?
                        AND sd.date BETWEEN ? AND ?
                    )
                    ${groupFilter}
                ORDER BY 
                    cg.name,
                    c.delivery_order;
            `;

            const [rows] = await pool.query(sql, params);

            if (rows.length < 1) return null;

            return rows;

        } catch (error) {
            throw error;
        }
}


    

    
    
    
    

    

}

export default Sale