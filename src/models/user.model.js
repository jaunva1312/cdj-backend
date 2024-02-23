import bcrypt from "bcrypt";
import {createUniqueID} from '../libs/dataBase.js'
import {pool} from '../db.js'


class User {

    constructor(userName, password) {
      this._userID = createUniqueID();
      this._userName = userName;
      this._name = '';
      this._email = '';
      this._password = password;
      this._roles = '';
      this._customerGroupID = '';
      this._isEnable = 1;

    }

    //Getters
    get userID(){
        return this._userID;
    }

    get userName(){
        return this._userName;
    }

    get name(){
        return this._name;
    }

    get email(){
        return this._email;
    }


    get password(){
        return this._password;
    }

    get roles(){
        return this._roles;
    }

    get customerGroupID(){
        return this._customerGroupID;
    }

    get isEnable(){
        return this._isEnable;
    }


    //Setters

    set userID(userID){
        this._userID = userID;
    }

    set userName(userName){
        this._userName = userName;
    }

    set name(name){
        this._name = name;
    }

    set email(email){
        this._email = email;
    }

    set password(password){
        this._password = password;
    }

    set roles(rolesArray){
       this._roles = rolesArray;
    }

    

    set customerGroupID(customerGroupID){
        this._customerGroupID = customerGroupID;
    }

    set isEnable(isEnable){
        this._isEnable = isEnable;
    }

    static async encryptPassword (password){
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static async comparePassword (password, receivedPassword){
        return await bcrypt.compare(password, receivedPassword);
    }
    

    static async findByID(id,propertiesToRemove){

        try {
           
            var sql = 'SELECT * FROM User WHERE id = ?';
    
            const [rows] = await pool.query(sql,[id]); 
    
            if(rows.length < 1) return null;

            let userObject = User.castUserModel(rows[0],propertiesToRemove);
            
            return userObject;

        
        } catch (error) {
            
            throw('Something went wrong finding user by UserID:' + error);
            
        }

    }

    static async findByUserName(userName,propertiesToRemove){

        try {
           
            var sql = 'SELECT * FROM User WHERE user_name = ?';
    
            const [rows] = await pool.query(sql,[userName]); 
    
            if(rows.length < 1) return null;

            let rawUserObject = rows[0];
            
            const user = this.castUserModel(rawUserObject, propertiesToRemove);
          
            return user;

        
        } catch (error) {
            
            throw('Something went wrong finding user by UserName: ' + error);
            
        }

    }

    
    static async findEmail(email){

        try {
           
            var sql = 'SELECT * FROM User WHERE email = ?';
    
            const [rows] = await pool.query(sql,[email]); 
    
            if(rows.length < 1) return null;
            
            return rows[0].email;

        
        } catch (error) {
            
            throw('Something went wrong finding the Email: ' + error);
            
        }

    }


    static async getAllUsers(){

        var users = [];

        try{

            var sql = 'SELECT * FROM User';
            const [rows] = await pool.query(sql); 

            if(rows.length < 1) return res.status(404).json({
                menssage: 'No users'
            });

            rows.forEach(rawUser =>{
                users.push(this.castUserModel(rawUser));
            });

            return users;

        } catch(error){
            throw(error);
        }
    }


    static async createUser(userObject) {
            
        try {

            const newUser = this.castUserModel(userObject);

            if(userObject.roles.length < 0){
                newUser.roles = ["USER"];
            }
               
            //SQL query to insert new unser
            var sql = `INSERT INTO User(
                id, 
                user_name,
                name,
                email,
                password,
                roles, 
                customer_group_id, 
                is_enable)
                VALUES(?,?,?,?,?,?,?,?) `;

            //Inser new user
            const [rows] = await pool.query(sql,
                [
                    newUser.userID, 
                    newUser.userName, 
                    newUser.name, 
                    newUser.email,
                    newUser.password,
                    newUser.roles.toString(),
                    newUser.customerGroupID, 
                    newUser.isEnable
                ]
            );
            
            return newUser;
    
        } catch (error) {
            throw (error);
        }
    
    }

    static async updateUser(modifiedUserObject, id){

        try {

            var sql = `UPDATE User SET
                name = IFNULL(?,name), 
                password = IFNULL(?,password), 
                roles = IFNULL(?,roles), 
                customer_group_id = IFNULL(?,customer_group_id), 
                is_enable = IFNULL(?,is_enable)
                WHERE id = ?`;

            var sqlConsult = 'SELECT * FROM User WHERE id = ?';


            const {
                name, 
                password,
                roles,
                customer_group_id, 
                is_enable
            } = modifiedUserObject

            const [result] = await pool.query(sql, [
                name, 
                password, 
                roles.toString(), 
                customer_group_id,
                is_enable, id
            ]);
           
            if(result.affectedRows === 0) throw ("User not found");

            let  [rows] = await pool.query(sqlConsult,[id]);

            //Convert roles string to an array
            rows[0].roles = rows[0].roles.split(",");

            return rows[0];

        } catch (error) {
            throw (error);
        }
    }

    static async deleteUser(id){

        try {

            var sql = 'DELETE FROM User WHERE id = ?'

            const [result] = await pool.query(sql,[id]); 
            
            return result.affectedRows;


        } catch (error) {
            throw (error);
        }

    }

    
    
    static castUserModel(rawUserObject, propertiesToRemove){

        //Convert roles property to an array

        const newUser = new User(rawUserObject.user_name, rawUserObject.password);

        if(rawUserObject.id != null){        
            newUser.id = rawUserObject.id;
        }

        newUser.name = rawUserObject.name;
        newUser.email = rawUserObject.email;
        newUser.customerGroupID = rawUserObject.customer_group_id;
        newUser.isEnable = rawUserObject.is_enable;
        
        if(Array.isArray(rawUserObject.roles)){
            newUser.roles = rawUserObject.roles;
        }else{
            newUser.roles = rawUserObject.roles.split(",");
        }

        if(propertiesToRemove){
            propertiesToRemove.forEach(property => {
                delete newUser[property];
            });
        }

        return newUser;

    }
    
    


 


}

export default User
