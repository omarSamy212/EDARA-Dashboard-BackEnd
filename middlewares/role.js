const role = (role) =>{
return (req, res, next) => {
        const user = req.user;
        if(user.userType != role)
        {
            console.log("Invalid Role")
            res.status(401);
            return res.json({message: "Invalid Role"});
        }
        next();
    };

};

module.exports = role;