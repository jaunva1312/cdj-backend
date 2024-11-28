import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'
import moment from 'moment';

class Sale  {

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
                CAST(SUM(IFNULL(i.quantity, 0)) AS SIGNED) AS total_entries,
                CAST(
                    CASE 
                        WHEN i.product_id = '0f0221fd' THEN 
                            SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))
                        ELSE 
                            SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))
                    END AS SIGNED
                ) AS total_returns,
                CAST(
                    SUM(IFNULL(i.quantity, 0)) - 
                    CASE 
                        WHEN i.product_id = '0f0221fd' THEN 
                            SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))
                        ELSE 
                            SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))
                    END AS SIGNED
                ) AS total,
                IFNULL(p.price, 0) AS price,
                (p.price * 
                    (SUM(IFNULL(i.quantity, 0)) - 
                    CASE 
                        WHEN i.product_id = '0f0221fd' THEN 
                            SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))
                        ELSE 
                            SUM(IFNULL(r.hot_return, 0)) + SUM(IFNULL(r.cold_return, 0)) + SUM(IFNULL(r.poor_condition_return, 0))
                    END)
                ) AS ammount
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
    
    
    

    

}

export default Sale