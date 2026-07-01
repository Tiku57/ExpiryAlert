import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  "Vendor Contracts",
  "Compliance Certificates",
  "Insurance Policies",
  "Government Licenses",
  "Safety Training",
  "Machine Inspection Reports",
  "Employee Certifications",
  "Software Licenses",
  "Lease Agreements",
  "NDAs",
  "Service Agreements"
];

const companies = [
  "Deloitte", "EY", "KPMG", "PwC", "Accenture", 
  "Tata Steel", "Reliance", "JSW", "Vedanta", "Adani", 
  "AWS", "Microsoft", "Google", "Siemens", "Schneider Electric"
];

const documentTitles = [
  "Enterprise Support Contract",
  "Enterprise Agreement",
  "ISO 27001 Certification",
  "Factory Fire Safety Certificate",
  "Annual Machine Inspection",
  "Office Lease Agreement",
  "Employee Safety Training",
  "Environmental Compliance Certificate",
  "Enterprise License",
  "Maintenance Contract",
  "Non-Disclosure Agreement",
  "Health & Safety Audit",
  "Worker Compensation Policy",
  "Tax Compliance Certificate"
];

// Helper to get random item
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log('Starting seed...');

  // 1. Get all organizations, or create a default one if none exist
  let orgs = await prisma.organization.findMany();
  
  if (orgs.length === 0) {
    const org = await prisma.organization.create({
      data: { name: 'Demo Enterprise' },
    });
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: hashedPassword,
        organizationId: org.id,
      },
    });
    
    orgs = [org];
  }

  for (const organization of orgs) {
    console.log(`Seeding organization: ${organization.name}`);
    
    const user = await prisma.user.findFirst({
      where: { organizationId: organization.id }
    });

    if (!user) continue;

  console.log(`Created Org & User: ${user.email}`);

  // 2. Create Categories
  const categoryRecords = [];
  for (const cat of categories) {
    let c = await prisma.category.findFirst({
      where: { name: cat, organizationId: organization.id },
    });
    
    if (!c) {
      c = await prisma.category.create({
        data: { name: cat, organizationId: organization.id },
      });
    }
    categoryRecords.push(c);
  }

  // 3. Clear existing records for Demo Enterprise if any
  await prisma.record.deleteMany({
    where: { organizationId: organization.id }
  });

  // 4. Generate 50 realistic records
  console.log('Generating records...');
  const numRecords = 50;
  
  

  for (let i = 0; i < numRecords; i++) {
    const company = getRandom(companies);
    const title = `${company} ${getRandom(documentTitles)}`;
    const category = getRandom(categoryRecords);
    
    // Distribute statuses realistically
    // 60% Active, 20% Expiring Soon, 10% Critical, 10% Expired
    const rand = Math.random();
    let status = "Active";
    let daysOffset = 0;

    if (rand < 0.6) {
      status = "Active";
      daysOffset = getRandomInt(31, 365); // 31 to 365 days in future
    } else if (rand < 0.8) {
      status = "Expiring Soon";
      daysOffset = getRandomInt(8, 30); // 8 to 30 days
    } else if (rand < 0.9) {
      status = "Critical";
      daysOffset = getRandomInt(1, 7); // 1 to 7 days
    } else {
      status = "Expired";
      daysOffset = getRandomInt(-60, -1); // 1 to 60 days in past
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysOffset);

    // Create record
    const record = await prisma.record.create({
      data: {
        title: title,
        description: `Official document related to ${company}. Handled by internal compliance team.`,
        expiryDate: expiryDate,
        status: status,
        categoryId: category.id,
        organizationId: organization.id,
      },
    });

    // Generate random attachments
    if (Math.random() > 0.3) {
      await prisma.attachment.create({
        data: {
          fileName: `${company}_Document_${expiryDate.getFullYear()}.pdf`,
          fileUrl: `https://example.com/docs/${record.id}.pdf`,
          fileType: 'application/pdf',
          fileSize: getRandomInt(100, 5000) * 1024, // 100KB - 5MB
          recordId: record.id,
        }
      });
    }

    // Generate activity logs
    await prisma.activityLog.create({
      data: {
        action: 'CREATED',
        details: `Record created for ${title}`,
        recordId: record.id,
        userId: user.id
      }
    });

    // If renewed previously (simulate history)
    if (Math.random() > 0.7) {
      const pastExpiry = new Date(expiryDate);
      pastExpiry.setFullYear(pastExpiry.getFullYear() - 1);
      
      await prisma.renewalHistory.create({
        data: {
          previousExpiry: pastExpiry,
          newExpiry: expiryDate,
          notes: 'Annual renewal completed successfully.',
          recordId: record.id,
        }
      });
      
      await prisma.activityLog.create({
        data: {
          action: 'RENEWED',
          details: `Record renewed for ${title}`,
          recordId: record.id,
          userId: user.id
        }
      });
    }

    // Generate notifications for critical/expired
    if (status === "Critical" || status === "Expired") {
      await prisma.notification.create({
        data: {
          title: `Action Required: ${title}`,
          message: status === "Critical" ? `This document expires in ${daysOffset} days.` : `This document has expired!`,
          isRead: Math.random() > 0.5,
          recordId: record.id,
        }
      });
    }
  }
  
  } // End of organizations loop

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
