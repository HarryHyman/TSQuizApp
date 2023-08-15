const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.role.createMany({
        data: [
            {
                id: 1,
                name: "user",
            },
            {
                id: 2,
                name: "admin",
            }
        ],
    });
};

main()
.catch(e => {
    console.error(e);
})
.finally(async () => {
    await prisma.$disconnect();
});