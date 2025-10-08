import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sites = [
    {
      siteId: 'JDSD0001',
      legacyId: 'LEG001',
      region5: 'Central',
      region13: 'Al Bahah',
      city: 'Al Bahah',
      district: 'Al Baghdadia Al Gharbiya',
      latitude: 21.55881111,
      longitude: 39.11936944,
      installationDate: new Date('2024-01-15'),
      status: 'Active',
      technicianName: 'John Doe',
      technicianEmail: 'john@example.com'
    },
    {
      siteId: 'DAM020',
      legacyId: 'LEG002',
      region5: 'Northern',
      region13: 'Al Jawf',
      city: 'Al Hajrah',
      district: 'Ar Rabie',
      latitude: 26.439435,
      longitude: 50.1158463,
      installationDate: new Date('2024-02-20'),
      status: 'Active',
      technicianName: 'Jane Smith',
      technicianEmail: 'jane@example.com'
    },
    // Add more sample sites...
  ];

  for (const site of sites) {
    await prisma.site.upsert({
      where: { siteId: site.siteId },
      update: {},
      create: site,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });