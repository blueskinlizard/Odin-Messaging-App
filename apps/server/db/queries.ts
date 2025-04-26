import { connect } from "http2";
import { PrismaClient } from './generated/prisma/index.js'; 

const prisma = new PrismaClient();

export const createUser = async (name: string, hashedPassword: string) => {
    return await prisma.userValues.create({
        data: {
            name: name.toLowerCase(),
            password: hashedPassword
        }
    })
}
export const findUserById = async (id: string) => { //Finds users by id
    return prisma.userValues.findUnique({ where: { id: id } });
}
export const findUserByName = async(username: string) =>{
    return prisma.userValues.findFirst({ where: { name: username.toLowerCase() } });
}
export const findLatestMessage = async (conversationId: string) => {    
    return await prisma.message.findFirst({
        where: {
            conversationId: conversationId
        },
        orderBy: { 
            createdAt: 'desc', //Orders messages by date in descending order, finding latest
        }
    })
}
export const findAllMessages = async (senderId: string, receiverId: string) => {
    //Fetches by name, too lazy to change ID variable
    if (!senderId || !receiverId) {
        console.error("Invalid parameters:", { senderId, receiverId });
        return null;
    }
    return await prisma.conversation.findFirst({ 
        where: {
            AND: [
                { participants: { some: { name: senderId.toLowerCase() } } },
                { participants: { some: { name: receiverId.toLowerCase() } } }
            ]
        },
        select: {
            id: true,
            messages: true,
            participants: true
        }
    });
};
export const findConversation = async(conversationId: string) =>{
    return prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            participants: true,
            messages: true
        }
    });
}
export const createConversation = async(requesterName: string, participantName: string) => {
    const requesterUser = await findUserByName(requesterName);
    const participantUser = await findUserByName(participantName);
    
    if (!requesterUser || !participantUser) {
        throw new Error("One or both users not found");
    }
    
    return await prisma.conversation.create({
        data: {
            participants: {
                connect: [
                    {id: requesterUser.id},
                    {id: participantUser.id}
                ]
            }
        },
        select: {
            id: true
        }
    });
}
export const createMessage = async(authorUser: any, recipientUser: any, conversationId: string, messageContent: string) => { //Finds now by ID
    //Authoruser and recipient user are both passed in as id values, NOT OBJECTS, by messageroutes
    if (!authorUser || !recipientUser || !conversationId || !messageContent) {
        console.error('Missing data in createMessage', { authorUser, recipientUser, conversationId, messageContent });
        throw new Error('Invalid message creation parameters.');
    } //Guard clause
    await prisma.message.create({
        data: { //Author and recipient need to be objects, not strings! Almost made this error
            content: messageContent,
            author: {
                connect: { id: authorUser }  
            },
            recipient: {
                connect: { id: recipientUser } 
            },
            Conversation: { 
                connect: { id: conversationId }
            }
        }
    })
}