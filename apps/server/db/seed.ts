const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main(){
    console.log("Running");
    await prisma.user.create({
        data: {name: 'John Doe'},
    })
}    
main();