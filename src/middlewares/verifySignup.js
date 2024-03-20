import User from '../models/user.model.js'

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {

    if(req.body.user_name == null || req.body.password == null){
        return res.status(400).json({message: 'The user name and password are required to create a new user',data: req.body});
    }

    const user = await User.findByUserName(req.body.user_name,["password"]);

    if (user) return res.status(400).json({message: 'The user already exist'});

    const email = await User.findEmail(req.body.email);
    
    if (email) return res.status(400).json({message: 'The email is already register'});

    next();


}