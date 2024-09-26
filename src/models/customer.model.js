import {pool} from '../db.js'

class Customer  {
    
    constructor() {
        
        this.customerID = this.createID();
        this.createdAt = new Date();
        this.createdBy = createdBy;
        this.customerGroupID;
        this.deliveryOrder;
        this.customerName;
        this.deliveryDays;
        this.address;
        this.location;
        this.mobilePhone;
        this.email = email;
        this.rfc;
        this.municipality;
        this.state;
        this.country;
        this.isEnable = 1;
    }


    createID() {
        var max = 4294967295;
        var min = 0;
        var randomNumber = (Math.floor(min+ Math.random()*(max-min+1))).toString(16);
        //console.log(randomNumber);
        return randomNumber  
    }

    findNearestCustomers(){

    }

    static async getCustomers(){
        
        try {
            
            var sql = `SELECT * FROM customer`
            
            const [rows] = await pool.query(sql); 

            if(rows.length < 1) return null;
            
            return rows;  

        } catch (error) {
            throw(error);
        } 

    }

    static async getNearestSellPoint(lat, long){

        try {
            
            var sql = 
                `SELECT id,name,alias,customer_group_id,address,coordinates,
                    ST_Distance_Sphere(
                      POINT(?, ?),      
                      coordinates
                    ) as distance
                FROM customer
                
                WHERE 
                coordinates IS NOT NULL
                 
                ORDER BY distance
                LIMIT 5`
                const [rows] = await pool.query(sql,[long,lat]);

                if(rows.length < 1) return null;
            
                return rows; 

        } catch (error) {
            throw(error);
        } 

    }
    
    
}

export { Customer };

