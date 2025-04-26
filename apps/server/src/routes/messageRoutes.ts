const express = require('express');
const router = express.Router();
const  db  = require("../../db/queries.ts")
//Finds convo off sender and receiver, more of an optional thing if Im too lazy to implement conversation ID
router.post('/conversations/', async(req: any, res: any) =>{ 
    const { receiver } = req.body;
        
        if (!receiver) {
            return res.status(400).json({ error: 'Receiver is required' });
        }
        try{
            if (!req.user) {
                return res.status(401).json({ error: 'User not authenticated' });
            } 
            const sender = req.user.name;
            const conversation = await db.findAllMessages(sender, receiver);
            //Converts to lowercase to avoid char mismatch
            if(!conversation){
                return res.status(404).json({ error: 'Conversation not found' });
            }
            return res.status(200).json({
                id: conversation.id,
                messages: conversation.messages
            });
        }catch(err){
            return res.status(500).json({error: 'Caught internal server error: '+err})
        }
        // Check if session exists and has username
        
})
router.post('/createmessage/', async(req: any, res: any) =>{
    const {recipientUser, conversationId, messageContent} = req.params;
    const currentUser = req.user.name;
    await db.createMessage(currentUser, recipientUser, conversationId, messageContent)
})
router.get('/conversations/:conversationId',  async(req: any, res: any) =>{
    try{
        const { conversationId } = req.params;
        const fetchedConversation = await db.findConversation(conversationId);
        res.status(200).json(fetchedConversation);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error, Conversation Id fetch' });
    }
})
router.get('/latestMessage/:conversationId', async(req: any, res: any) =>{
    try{
        const {conversationId } = req.params;
        const lastMessage = await db.findLatestMessage(conversationId,);
        return res.status(200).json(lastMessage);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error, Latest message fetch' });
    }
})

module.exports = router;