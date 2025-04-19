const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main(){
    console.log("Running");
    await prisma.userValues.create({ //weird Prisma naming convention
        data: {name: 'John Doe'},
    })
}    
main();