

class Customer  {
    
    constructor(createdBy, customerGroupID, deliveryOrder, customerName, customerAlias, deliveryDays, address, location, mobilePhone, email, rfc, municipality, state,country) {
        
        this.customerID = this.createID();
        this.createdAt = new Date();
        this.createdBy = createdBy;
        this.customerGroupID = customerGroupID;
        this.deliveryOrder = deliveryOrder;
        this.customerName = customerName;
        this.customerAlias = customerAlias;
        this.deliveryDays = deliveryDays;
        this.address = address;
        this.location = location
        this.mobilePhone = mobilePhone;
        this.email = email;
        this.rfc = rfc;
        this.municipality = municipality;
        this.state = state;
        this.country = country;
        this.isEnable = 1;
    }

    // get customerID(){
    //     return this.customerID;
    // }

    createID(){
        var max = 4294967295;
        var min = 0;
        var randomNumber = (Math.floor(min+ Math.random()*(max-min+1))).toString(16);
        //console.log(randomNumber);
        return randomNumber  
    }    
    
}

export { Customer };

