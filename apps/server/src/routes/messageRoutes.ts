const express = require('express');
const router = express.Router();
const db = require('../../db/queries')
//Finds convo off sender and receiver, more of an optional thing if Im too lazy to implement conversation ID
router.post('/conversations/', async(req: any, res: any) =>{ 
    const { receiver } = req.body;
    try{
        const sender = req.session.username;
        const conversation = await db.findAllMessages(sender.toLowerCase(), receiver.toLowerCase());
        //Converts to lowercase to avoid char mismatch
        if(!conversation){
            return res.status(404).json({ error: 'Conversation not found' });
        }
        const messages = conversation.messages;
        res.status(200).json(messages);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error, Conversation via name fetch' });
    }
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
        const lastMessage = await db.findLatestMessage(conversationId);
        return res.status(200).json(lastMessage);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error, Latest message fetch' });
    }
})
