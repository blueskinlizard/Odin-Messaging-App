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
    return prisma.userValues.findUnique({ where: { name: username } });
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
    return await prisma.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { id: senderId } } },
                { participants: { some: { id: receiverId } } }
            ]
        },
        include: {
            messages: true
        }
    });
};

module.exports ={
    createUser,
    findUserById,
    findUserByName,
    createMessage,
    findLatestMessage,
    findAllMessages
}