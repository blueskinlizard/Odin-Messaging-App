const express = require('express');
const router = express.router();
const db = require('../../db/queries')

router.post("/findUser", async(req: any, res: any) =>{
    const { userName } = req.body;
    try{
        const user = await db.findUserByName(userName);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    }catch(err: any){
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
})