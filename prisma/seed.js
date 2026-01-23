const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = "oppspacesapp@gmail.com";
    const password = "oppspaces2025";

    console.log('Seeding admin user...');

    // Check if admin exists
    const existingUser = await prisma.adminUser.findUnique({
        where: { email },
    });

    if (!existingUser) {
        const hashedPassword = await hash(password, 12);
        await prisma.adminUser.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        console.log(`Created admin user: ${email}`);
    } else {
        // Optional: Update password if needed to ensure access
        const hashedPassword = await hash(password, 12);
        await prisma.adminUser.update({
            where: { email },
            data: { password: hashedPassword }
        });
        console.log(`Updated admin user: ${email}`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
