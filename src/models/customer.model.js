

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
    
    
}

export { Customer };

