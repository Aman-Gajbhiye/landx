import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const mockProperties = [
    {
        city: "Mumbai",
        name: "Prestige Corporate Tower",
        type: "Commercial",
        rentYield: 7.5,
        minInvestment: 50000,
        appreciation: 12,
        image: "/properties/1.jpg",
        fundedAmount: 350000, // Partial funded mock
    },
    {
        city: "Bangalore",
        name: "Green Valley Residences",
        type: "Residential",
        rentYield: 6.2,
        minInvestment: 40000,
        appreciation: 10,
        image: "/properties/2.jpg",
        fundedAmount: 120000,
    },
    {
        city: "Delhi",
        name: "Downtown Plaza",
        type: "Mixed Use",
        rentYield: 8.1,
        minInvestment: 60000,
        appreciation: 14,
        image: "/properties/3.jpg",
        fundedAmount: 800000,
    },
    {
        city: "Hyderabad",
        name: "Tech Park Hub",
        type: "Commercial",
        rentYield: 7.8,
        minInvestment: 55000,
        appreciation: 13,
        image: "/properties/4.jpg",
        fundedAmount: 0,
    },
    {
        city: "Pune",
        name: "Riverside Apartments",
        type: "Residential",
        rentYield: 5.9,
        minInvestment: 35000,
        appreciation: 9,
        image: "/properties/5.jpg",
        fundedAmount: 45000,
    },
    {
        city: "Chennai",
        name: "Marina Heights",
        type: "Residential",
        rentYield: 6.5,
        minInvestment: 42000,
        appreciation: 11,
        image: "/properties/6.jpg",
        fundedAmount: 400000,
    },
]

async function main() {
    console.log('Start seeding ...')

    // Create Mock User
    const user = await prisma.user.upsert({
        where: { email: 'demo@landx.com' },
        update: {},
        create: {
            email: 'demo@landx.com',
            name: 'Demo User',
        },
    })
    console.log('Created user:', user)

    // Create Properties
    for (const p of mockProperties) {
        const property = await prisma.property.create({
            data: p,
        })
        console.log(`Created property with id: ${property.id}`)
    }

    // Create some mock investments for the user
    const prop1 = await prisma.property.findFirst({ where: { name: "Prestige Corporate Tower" } })
    if (prop1) {
        await prisma.investment.create({
            data: {
                amount: 25000,
                userId: user.id,
                propertyId: prop1.id
            }
        })
        console.log('Created mock investment for user')
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
