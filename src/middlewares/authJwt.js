import jwt from 'jsonwebtoken'
import config from '../config.js'
import User from '../models/user.model.js';

export const verifyToken = async (req,res,next) => {

    try{

        const token = req.headers["x-auth-token"];

        if(!token) return res.status(403).json({message: "No token provided"});

        const decoded = jwt.verify(token, config.SECRET);
    
        req.id = decoded.id;
    
        const user = await User.findByID(req.id);
    
        if(!user) return res.status(404).json({message: 'Auth user not found token'});

        next();

    }
    catch(error){
        return res.status(401).json({message: "Unauthorized" + error})
    }
}

export const isDeliveryMan = async(req,res,next) =>{
    
    const user = await User.findByID(req.id);
    const roles = user.roles;

    for (let i= 0; i < roles.length; i++){
        if (roles[i] == "REPARTIDOR" || roles[i] == "SUPERVISOR VENTAS" || roles[i] == "ADMIN" || roles[i] == "SUPER ADMIN"){
            next();
            return;
        }
    }
 
    return res.status(403).json({message: "Require REPARTIDOR role"});
}

export const isAdmin = async(req,res,next) =>{

    const user = await User.findByID(req.id);
    const roles = user.roles;

    for (let i= 0; i < roles.length; i++){
        if (roles[i] == "ADMIN" || roles[i] == "SUPER ADMIN"){
            next();
            return;
        }
    }
 
    return res.status(403).json({message: "Require ADMIN role"});
}

export const isSalesSupervisor = async(req,res,next) =>{
    const user = await User.findByID(req.id);
    const roles = user.roles;

    for (let i= 0; i < roles.length; i++){
        if (roles[i] == "SUPERVISOR VENTAS" || roles[i] == "ADMIN" || roles[i] == "SUPER ADMIN"){
            next();
            return;
        }
    }
 
    return res.status(403).json({message: "Require SUPERVISOR VENTAS role"});
}

export const isSuperAdmin = async(req,res,next) =>{
    const user = await User.findByID(req.id);
    const roles = user.roles;

    for (let i= 0; i < roles.length; i++){
        if (roles[i] == roles[i] == "SUPER ADMIN"){
            next();
            return;
        }
    }
 
    return res.status(403).json({message: "Require SUPER ADMIN VENTAS role"});
}