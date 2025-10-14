import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample sites
  const site1 = await prisma.site_inventory.upsert({
    where: { Site_ID: 'RYD-001' },
    update: {},
    create: {
      Site_ID: 'RYD-001',
      Legacy_Site_ID: 'OLD-RYD-001',
      Site_Group: 'Central Sites',
      Site_Type: 'Macro Site',
      Region13: 'Riyadh',
      Region5: 'Central',
      City: 'Riyadh',
      District: 'Al Olaya',
      Latitude: 24.7136,
      Longitude: 46.6753,
      Status: 'Active',
      Operator: 'STC',
      Owner: 'STC',
      Installation_Date: new Date('2023-01-15'),
      technician_name: 'Ahmed Ali',
      technician_email: 'ahmed.ali@example.com',
    },
  });

  const site2 = await prisma.site_inventory.upsert({
    where: { Site_ID: 'JED-001' },
    update: {},
    create: {
      Site_ID: 'JED-001',
      Legacy_Site_ID: 'OLD-JED-001',
      Site_Group: 'Western Sites',
      Site_Type: 'Macro Site',
      Region13: 'Makkah',
      Region5: 'Western',
      City: 'Jeddah',
      District: 'Al Hamra',
      Latitude: 21.4858,
      Longitude: 39.1925,
      Status: 'Active',
      Operator: 'Mobily',
      Owner: 'Mobily',
      Installation_Date: new Date('2023-02-20'),
      technician_name: 'Fatima Hassan',
      technician_email: 'fatima.hassan@example.com',
    },
  });

  const site3 = await prisma.site_inventory.upsert({
    where: { Site_ID: 'DMM-001' },
    update: {},
    create: {
      Site_ID: 'DMM-001',
      Legacy_Site_ID: 'OLD-DMM-001',
      Site_Group: 'Eastern Sites',
      Site_Type: 'Macro Site',
      Region13: 'Eastern Province',
      Region5: 'Eastern',
      City: 'Dammam',
      District: 'Al Faisaliyah',
      Latitude: 26.4207,
      Longitude: 50.0888,
      Status: 'Active',
      Operator: 'Zain',
      Owner: 'Zain',
      Installation_Date: new Date('2023-03-10'),
      technician_name: 'Mohammed Saleh',
      technician_email: 'mohammed.saleh@example.com',
    },
  });

  console.log('✅ Created 3 sites');

  // Create sample devices
  const device1 = await prisma.device_inventory.upsert({
    where: {
      NE_Name_Site_ID: {
        NE_Name: 'RYD-001-BBU-01',
        Site_ID: 'RYD-001',
      },
    },
    update: {},
    create: {
      NE_Name: 'RYD-001-BBU-01',
      Site_ID: 'RYD-001',
      Serial_Number: 'BBU123456789',
      Operator_ID: 'STC-OP-001',
      NE_IP_Address: '192.168.1.10',
      NE_MAC_Address: '00:1A:2B:3C:4D:5E',
      Model_Number: 'BBU5900',
      Vendor: 'Huawei',
      Device_Type: 'BBU',
      Equipment_Role: 'Core',
      Technology: '5G',
      Domain: 'Radio Access Network (RAN)',
      Sub_Domain: '5G NR',
      Status: 'Active',
      Installation_Date: new Date('2023-01-20'),
      technician_name: 'Ahmed Ali',
      technician_email: 'ahmed.ali@example.com',
    },
  });

  const device2 = await prisma.device_inventory.upsert({
    where: {
      NE_Name_Site_ID: {
        NE_Name: 'JED-001-RRU-01',
        Site_ID: 'JED-001',
      },
    },
    update: {},
    create: {
      NE_Name: 'JED-001-RRU-01',
      Site_ID: 'JED-001',
      Serial_Number: 'RRU789012345',
      Operator_ID: 'MOB-OP-002',
      NE_IP_Address: '192.168.2.20',
      NE_MAC_Address: '00:1A:2B:3C:4D:5F',
      Model_Number: 'AEQD',
      Vendor: 'Nokia',
      Device_Type: 'RRU',
      Equipment_Role: 'Access',
      Technology: '4G/LTE',
      Domain: 'Radio Access Network (RAN)',
      Sub_Domain: '4G eNodeB',
      Status: 'Active',
      Installation_Date: new Date('2023-02-25'),
      technician_name: 'Fatima Hassan',
      technician_email: 'fatima.hassan@example.com',
    },
  });

  const device3 = await prisma.device_inventory.upsert({
    where: {
      NE_Name_Site_ID: {
        NE_Name: 'DMM-001-SWITCH-01',
        Site_ID: 'DMM-001',
      },
    },
    update: {},
    create: {
      NE_Name: 'DMM-001-SWITCH-01',
      Site_ID: 'DMM-001',
      Serial_Number: 'SW345678901',
      Operator_ID: 'ZAIN-OP-003',
      NE_IP_Address: '192.168.3.30',
      NE_MAC_Address: '00:1A:2B:3C:4D:60',
      Model_Number: 'Catalyst 9300',
      Vendor: 'Cisco',
      Device_Type: 'Switch',
      Equipment_Role: 'Aggregation',
      Technology: 'Ethernet',
      Domain: 'Transport Network',
      Sub_Domain: 'Metro Ethernet',
      Status: 'Active',
      Installation_Date: new Date('2023-03-15'),
      technician_name: 'Mohammed Saleh',
      technician_email: 'mohammed.saleh@example.com',
    },
  });

  const device4 = await prisma.device_inventory.upsert({
    where: {
      NE_Name_Site_ID: {
        NE_Name: 'RYD-001-ANTENNA-01',
        Site_ID: 'RYD-001',
      },
    },
    update: {},
    create: {
      NE_Name: 'RYD-001-ANTENNA-01',
      Site_ID: 'RYD-001',
      Serial_Number: 'ANT456789012',
      Operator_ID: 'STC-OP-004',
      NE_IP_Address: '192.168.1.11',
      Model_Number: 'Kathrein 80010541',
      Vendor: 'Ericsson',
      Device_Type: 'Antenna',
      Equipment_Role: 'Access',
      Technology: '5G',
      Domain: 'Radio Access Network (RAN)',
      Sub_Domain: '5G NR',
      Status: 'Active',
      Installation_Date: new Date('2023-01-22'),
      technician_name: 'Ahmed Ali',
      technician_email: 'ahmed.ali@example.com',
    },
  });

  console.log('Created 4 devices');

  console.log('Database seed completed successfully!');
  console.log('\nSummary:');
  console.log(`- Sites created: 3`);
  console.log(`- Devices created: 4`);
  console.log('\nYou can now run: npm run db:studio');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });