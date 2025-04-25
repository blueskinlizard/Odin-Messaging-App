const express = require('express');
const router = express.Router();
const passport = require('../auth/passportLogin.ts')
/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */

//Password fetches both of the req.body's in authentication middleware, no need to specify here
router.post("/login", async(req: any, res: any, next: any)=>{
    try{
        passport.authenticate('local-signin', async (err: any, user: any, info: any) =>{
            if (err) { 
                console.error("Authentication error:", err);
                return res.status(500).json({message: `Authentication error: ${err.message}`});
            };
            //Info.message is provided by passport
            console.log("Passport authenticate result:", { 
                err: err ? err.message : null, 
                userExists: !!user, 
                info: info ? info.message : null 
            });
            if(!user){ 
                return res.status(400).json({message: info?.message || "Login failed, absence of user from passport middleware"});
            }
            req.logIn(user, (err: any) =>{
                if (err) { return next(err); }
                return res.status(200).json({message: "User logged in successfully", user: user})
        })
    })(req, res, next);
  }catch(err){
    return res.status(500).json({message: "Error in login route, error: " + err});
  }    
})
    
router.post("/signup", async(req: any, res: any, next: any)=>{
    try{
    
        passport.authenticate('local-signup', async (err: any, user: any, info: any) =>{
            if (err) { return next(err); }
            console.log("Passport authenticate result:", { 
                err: err ? err.message : null, 
                userExists: !!user, 
                info: info ? info.message : null 
            });
            if(!user){ 
                return res.status(400).json({message: info?.message || "Login failed, absence of user from passport middleware"});
            }
            req.logIn(user, (err: any) => { //Repeat functionality
                if(err) {return next(err)}
                return res.status(200).json({message: "User signed up successfully", user: user});
            })
        })(req, res, next)
    }catch(err){
        return res.status(500).json({message: "Error in signup route, error: " + err});
    }
})

module.exports = router;