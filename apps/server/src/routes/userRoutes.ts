const express = require('express');
const router = express.Router();
const  db  = require("../../db/queries.ts")

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
router.post("/createConversation", async(req: any, res: any) =>{
    const requester = req.user.name;
    const { participant } = req.body;
    try{
        const newConversation = await db.createConversation(requester, participant);
        return res.status(200).json(newConversation);
    }catch{
        return res.status(500).json({ message: "Failed to create conversation" });
    }
})
router.get("/currentUser", async(req: any, res: any) =>{
    if (!req.user) {
        return res.status(404).json({ message: "User not found" });
    }
    const user = await db.findUserByName(req.user.name);
    return res.status(200).json(user);
})

module.exports = router;