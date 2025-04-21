const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require('../../db/queries');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
    async (username: string, password: string, done: any) => {
        try {
            const user = db.findLatestMessage(username);
            if(!user){
                return done(null, false, { message: 'Incorrect or missing username' });
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        }catch(err){
            return done(err);
        }
    }
))

passport.serializeUser((user: any, done: any) =>{ //I dont know what type "done" is, so I'll avoid the type gymnastics
    done(null, user.id); //Stores session ID
})
passport.deserializeUser(async(id: string, done: any) =>{
    try{
        const user = await db.findUserById(id);
        done(null, user)
    }catch(err){
        done(err);
    }
})

module.exports = passport