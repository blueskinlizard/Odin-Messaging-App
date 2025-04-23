const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

export const createUser = async (name: string, hashedPassword: string) => {
    await prisma.userValues.create({
        data: {
            name: name,
            password: hashedPassword
        }
    })
}
export const findUserById = async (id: string) => { //Finds users by id
    return prisma.userValues.findUnique({ where: { id: id } });
}
export const findUserByName = async(username: string) =>{
    return prisma.userValues.findUnique({ where: { name: username.toLowerCase() } });
}
export const createMessage = async(senderId: string, receiverId: string, message: string) => {
    await prisma.message.create({
        data: {
            authorId: senderId,
            recipientId: receiverId,
            content: message
        },
        include: {
            author: true, //Searches up author and recipient objects given corresponding IDs
            recipient: true
        }
    })
}
export const findLatestMessage = async (senderId: string, receiverId: string) => {
    return await prisma.message.findFirst({
        where: {
            authorId: senderId,
            recipientId: receiverId,
        },
        order: {
            createdAt: 'desc', //Orders messages by date in descending order, finding latest
        }
    })
}
export const findAllMessages = async (senderId: string, receiverId: string) => {
    //Fetches by name, too lazy to change ID variable
    return await prisma.conversation.findUnique({
        where: {
            AND: [
                { participants: { some: { name: senderId.toLowerCase() } } },
                { participants: { some: { name: receiverId.toLowerCase() } } }
            ]
        },
        include: {
            messages: true,
            id: true
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
export const createConversation = async(requester: string, participant: string) =>{
    await prisma.conversation.create({
        data:{
            participants: {
                connect: [
                    {id: requester}, 
                    {id: participant}
                ]
            }
        }
    })
}
module.exports ={
    createUser,
    findUserById,
    findUserByName,
    createMessage,
    findLatestMessage,
    findAllMessages,
    findConversation,
    createConversation
}