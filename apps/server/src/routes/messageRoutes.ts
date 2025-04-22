const express = require('express');
const router = express.router();
const db = require('../../db/queries')
//Finds convo off sender and receiver, more of an optional thing if Im too lazy to implement conversation ID
router.post('conversations/', async(req: any, res: any) =>{ 
    const { receiver } = req.body;
    try{
        const sender = req.session.username;
        const conversation = await db.findAllMessages(sender, receiver);
        const messages = await conversation.messages;
        res.status(200).json(messages);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error, Conversation via name fetch' });
    }
}), 
router.get('conversations/:conversationId',  async(req: any, res: any) =>{
    try{
        const { conversation } = req.params;
        const fetchedConversation = await db.findConversation(conversation);
        res.status(200).json(fetchedConversation);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error, Conversation Id fetch' });
    }
})
router.get('latestMessage/:conversationId', async(req: any, res: any) =>{
    try{
        const {conversation} = req.params;
        const lastMessage = await db.findLatestMessage(conversation);
        return res.status(200).json(lastMessage);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error, Latest message fetch' });
    }
})
