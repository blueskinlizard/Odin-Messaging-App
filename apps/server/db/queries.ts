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
export const findUser = async (id: string) => { //Finds users by id
    return prisma.userValues.findUnique({ where: { id: id } });
}