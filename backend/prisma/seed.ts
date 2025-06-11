import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/fr';

const prisma = new PrismaClient();

async function main() {
  // Nettoyage de la base de données
  await prisma.calculation.deleteMany();
  await prisma.charge.deleteMany();
  await prisma.user.deleteMany();

  // Création des utilisateurs avec leurs tantièmes spécifiques
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: 'Jean Dupont',
        tantieme: 20.1,
        advanceCharges: 50,
        waterMeterOld: 800,
        waterMeterNew: 900,
      },
    }),
    prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: 'Marie Martin',
        tantieme: 40.8,
        advanceCharges: 100,
        waterMeterOld: 1200,
        waterMeterNew: 1300,
      },
    }),
    prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: 'Pierre Durand',
        tantieme: 39.1,
        advanceCharges: 75,
        waterMeterOld: 950,
        waterMeterNew: 1050,
      },
    }),
  ]);

  // Création des charges pour chaque utilisateur
  for (const user of users) {
    // Charges d'eau
    await prisma.charge.create({
      data: {
        type: 'WATER',
        amount: faker.number.float({ min: 100, max: 200, fractionDigits: 2 }),
        date: faker.date.recent(),
        startDate: faker.date.past({ years: 1 }),
        endDate: faker.date.future({ years: 1 }),
        description: "Facture d'eau trimestrielle",
        waterUnitPrice: faker.number.float({
          min: 2.7,
          max: 2.9,
          fractionDigits: 2,
        }),
        userId: user.id,
      },
    });

    // Charges d'assurance
    await prisma.charge.create({
      data: {
        type: 'INSURANCE',
        amount: faker.number.float({ min: 500, max: 1000, fractionDigits: 2 }),
        date: faker.date.recent(),
        startDate: faker.date.past({ years: 1 }),
        endDate: faker.date.future({ years: 1 }),
        description: 'Assurance annuelle',
        userId: user.id,
      },
    });

    // Charges bancaires
    await prisma.charge.create({
      data: {
        type: 'BANK',
        amount: faker.number.float({ min: 50, max: 150, fractionDigits: 2 }),
        date: faker.date.recent(),
        startDate: faker.date.past({ years: 1 }),
        endDate: faker.date.future({ years: 1 }),
        description: 'Frais bancaires',
        userId: user.id,
      },
    });

    // Création d'un calcul pour chaque utilisateur
    const waterAmount = (user.waterMeterNew - user.waterMeterOld) * 2.9;
    const insuranceAmount = (1000 * user.tantieme) / 100; // Exemple avec une assurance de 1000€
    const bankAmount = (100 * user.tantieme) / 100; // Exemple avec des frais bancaires de 100€
    const advanceCharges = user.advanceCharges * 3; // Exemple pour 3 mois
    const totalAmount =
      waterAmount + insuranceAmount + bankAmount - advanceCharges;

    await prisma.calculation.create({
      data: {
        userId: user.id,
        waterAmount,
        insuranceAmount,
        bankAmount,
        advanceCharges,
        totalAmount,
        date: faker.date.recent(),
      },
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
