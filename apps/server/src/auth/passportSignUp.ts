const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require('../../db/queries');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
    async (username: any, password: any, done: any) => {
        try{
            const presentUser = db.getUserByUsername(username);
            if(presentUser){
                return done(null, false, { message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10); 
            const user = await db.createUser(username, hashedPassword);
            return done(null, user)
        }catch(err){
            return done(err);
        }
    }
))
//Treated like normal account here given the initialization of one, same as login
//Boilerplate code if you want to consider it given reusage
passport.serializeUser((user: any, done: any) =>{ 
    done(null, user.id); 
})
passport.deserializeUser(async(id: string, done: any) =>{
    try{
        const user = await db.findUserById(id);
        done(null, user)
    }catch(err){
        done(err);
    }
})