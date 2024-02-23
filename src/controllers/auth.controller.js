import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import config from '../config.js'



export const signUp = async (req,res) => {

    //Encrypt password
    req.body.password = await User.encryptPassword(req.body.password);


    try{

        const newUser = await User.createUser(req.body);

        //Create token
        const token = jwt.sign({id: newUser.userID}, config.SECRET);

        
        //TODO: Token with expiration
        //const token = jwt.sign({id: newUser.userID}, config.SECRET, {
        //     expiresIn: 86400 // 24 hours
        //});


        //Send response
        res.status(200).json({token});

            
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong: ' +  error
        });
    }
    

}

export const login = async (req,res) => {


    try {
        const userFound = await User.findByUserName(req.body.user_name);

        const matchPassword = await User.comparePassword(req.body.password, userFound.password);

        if(!matchPassword) return res.status(401).json({token: null, message:"Invalid password"});


        //Create token
        const token = jwt.sign({id: userFound.userID}, config.SECRET);

        /* 
        Token with expiration

        const token = jwt.sign({id: userFound.UserID}, config.SECRET, {
            expiresIn: 86400 // 24 hours
        });
        */

        //Send response
        res.status(200).json({token});
        
        
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong' + error
        });
    }  
}

