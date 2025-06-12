// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   // Nettoyage de la base de données
//   await prisma.calculation.deleteMany();
//   await prisma.charge.deleteMany();
//   await prisma.user.deleteMany();

//   // Création des utilisateurs
//   const user1 = await prisma.user.create({
//     data: {
//       email: 'user1@example.com',
//       name: 'Jean Dupont',
//       tantieme: 100,
//       advanceCharges: 0,
//       waterMeterOld: 0,
//       waterMeterNew: 0,
//       password: await bcrypt.hash('password123', 10),
//       role: 'ADMIN',
//       coproprieteId: 'copro1',
//     },
//   });

//   const user2 = await prisma.user.create({
//     data: {
//       email: 'user2@example.com',
//       name: 'Marie Martin',
//       tantieme: 150,
//       advanceCharges: 0,
//       waterMeterOld: 0,
//       waterMeterNew: 0,
//       password: await bcrypt.hash('password123', 10),
//       role: 'basic',
//       coproprieteId: 'copro1',
//     },
//   });

//   const user3 = await prisma.user.create({
//     data: {
//       email: 'user3@example.com',
//       name: 'Pierre Durand',
//       tantieme: 200,
//       advanceCharges: 0,
//       waterMeterOld: 0,
//       waterMeterNew: 0,
//       password: await bcrypt.hash('password123', 10),
//       role: 'basic',
//       coproprieteId: 'copro1',
//     },
//   });

//   // Création des charges
//   const charge1 = await prisma.charge.create({
//     data: {
//       type: 'Eau',
//       amount: 150.5,
//       date: new Date(),
//       startDate: new Date(),
//       endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
//       description: 'Consommation eau trimestre 1',
//       userId: user1.id,
//     },
//   });

//   const charge2 = await prisma.charge.create({
//     data: {
//       type: 'Assurance',
//       amount: 300.0,
//       date: new Date(),
//       startDate: new Date(),
//       endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//       description: 'Assurance annuelle',
//       userId: user2.id,
//     },
//   });

//   const charge3 = await prisma.charge.create({
//     data: {
//       type: 'Frais bancaires',
//       amount: 50.0,
//       date: new Date(),
//       startDate: new Date(),
//       endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
//       description: 'Frais de gestion',
//       userId: user3.id,
//     },
//   });

//   console.log('Seed data created successfully');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
