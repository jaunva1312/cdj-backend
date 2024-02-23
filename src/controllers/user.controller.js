import User from '../models/user.model.js'



const user = {
    
    getUsers: async function(req,res) {
        try {
            const users = await User.getAllUsers();
            res.send(users);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong '  + error
            });
        }
    },

    
    
    getUser: async function(req,res) { 
        
        try {
           const user = await User.findByID(req.params.id);

           if(user == null) return res.status(404).json({
                menssage: 'User not found'
           });

           res.send(user);
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong getting user: ' + error
            });
        }  
        

    },
    
    

    updateUser: async function(req,res) { 
        
        try {

            const modifiedUser = await User.updateUser(req.body, req.params.id);
            res.send(modifiedUser);
            
        } catch (error) {
            if(error == "User not found"){
                res.status(404).json({
                    menssage: 'User not found-update'
                });
            }

            return res.status(500).json({
                message: 'Something goes wrong: ' + error
            });
        }
    },

    deleteUser: async function(req,res) { 

        try {
            
            const deleteUserRows = await User.deleteUser(req.params.id);
            
            if(deleteUserRows < 1){
                return res.status(404).json({
                    menssage: 'User not found-delete'
                });
            }

            res.sendStatus(204);
            
                     
        } catch (error) {
            return res.status(500).json({
                message: 'Something goes wrong'
            });
        }
    }
}

export default user