"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { getExpiryStatus } from "@/lib/expiry-logic";

async function getOrganizationId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.organizationId) {
    const org = await prisma.organization.create({
      data: { name: `${user?.name || "User"}'s Organization` },
    });
    user = await prisma.user.update({
      where: { id: session.user.id },
      data: { organizationId: org.id },
    });
  }

  if (!user?.organizationId) throw new Error("Organization not found");
  return user.organizationId;
}

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const hash = randomBytes(16).toString("hex");
  const filename = `${hash}${ext}`;
  const filepath = path.join(process.cwd(), "public/uploads", filename);

  await fs.mkdir(path.join(process.cwd(), "public/uploads"), { recursive: true });
  await fs.writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}

export async function createRecord(data: {
  title: string;
  category: string;
  vendor: string;
  expiryDate: string;
  priority: string;
  notes?: string;
  fileUrl?: string;
}) {
  const orgId = await getOrganizationId();

  let category = await prisma.category.findFirst({
    where: { name: data.category, organizationId: orgId },
  });
  if (!category) {
    category = await prisma.category.create({
      data: { name: data.category, organizationId: orgId },
    });
  }
  
  const expiryDate = new Date(data.expiryDate);
  const status = getExpiryStatus(expiryDate);

  const record = await prisma.record.create({
    data: {
      title: data.title,
      description: data.vendor,
      expiryDate,
      priority: data.priority,
      status,
      notes: data.notes,
      categoryId: category.id,
      organizationId: orgId,
    },
  });

  if (data.fileUrl) {
    await prisma.attachment.create({
      data: {
        recordId: record.id,
        fileName: path.basename(data.fileUrl),
        fileUrl: data.fileUrl,
      }
    });
  }

  await prisma.activityLog.create({
    data: {
      action: "Record Created",
      details: "New record added to the system",
      recordId: record.id,
    },
  });

  revalidatePath("/dashboard/records");
  return record;
}

export async function updateRecord(id: string, data: { title?: string; category?: string; vendor?: string; expiryDate?: string | Date; priority?: string; notes?: string; fileUrl?: string }) {
  const orgId = await getOrganizationId();

  const existing = await prisma.record.findUnique({ where: { id } });
  if (!existing) throw new Error("Record not found");
  if (existing.organizationId !== orgId) throw new Error("Unauthorized");

  const expiryDate = data.expiryDate ? new Date(data.expiryDate) : existing.expiryDate;
  const status = getExpiryStatus(expiryDate);

  let categoryId = existing.categoryId;
  if (data.category) {
    let category = await prisma.category.findFirst({
      where: { name: data.category, organizationId: orgId },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name: data.category, organizationId: orgId },
      });
    }
    categoryId = category.id;
  }

  const record = await prisma.record.update({
    where: { id },
    data: {
      title: data.title,
      description: data.vendor,
      expiryDate,
      priority: data.priority,
      status,
      notes: data.notes,
      categoryId,
    },
  });

  if (data.fileUrl) {
    await prisma.attachment.create({
      data: {
        recordId: record.id,
        fileName: path.basename(data.fileUrl),
        fileUrl: data.fileUrl,
      }
    });
  }

  await prisma.activityLog.create({
    data: {
      action: "Record Updated",
      details: "Record details were modified",
      recordId: id,
    },
  });

  revalidatePath("/dashboard/records");
  revalidatePath(`/dashboard/records/${id}`);
  return record;
}

export async function deleteRecord(id: string) {
  const orgId = await getOrganizationId();

  const existing = await prisma.record.findUnique({ where: { id } });
  if (!existing) throw new Error("Record not found");
  if (existing.organizationId !== orgId) throw new Error("Unauthorized");

  await prisma.activityLog.deleteMany({ where: { recordId: id } });
  await prisma.notification.deleteMany({ where: { recordId: id } });

  await prisma.record.delete({ where: { id } });

  revalidatePath("/dashboard", "layout");
}

export async function renewRecord(id: string, newExpiry: string, notes?: string) {
  const orgId = await getOrganizationId();

  const existing = await prisma.record.findUnique({ where: { id } });
  if (!existing) throw new Error("Record not found");
  if (existing.organizationId !== orgId) throw new Error("Unauthorized");

  const expiryDate = new Date(newExpiry);
  const status = getExpiryStatus(expiryDate);

  const record = await prisma.record.update({
    where: { id },
    data: {
      expiryDate,
      status,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "Record Renewed",
      details: `Renewed until ${expiryDate.toLocaleDateString()}${notes ? `. Notes: ${notes}` : ''}`,
      recordId: id,
    },
  });

  await prisma.notification.create({
    data: {
      title: "Record Renewed",
      message: `${record.title} has been renewed until ${expiryDate.toLocaleDateString()}`,
      recordId: record.id,
    }
  })

  revalidatePath("/dashboard/records");
  revalidatePath(`/dashboard/records/${id}`);
  return record;
}

export async function bulkDeleteRecords(ids: string[]) {
  const orgId = await getOrganizationId();

  await prisma.activityLog.deleteMany({ where: { recordId: { in: ids } } });
  await prisma.notification.deleteMany({ where: { recordId: { in: ids } } });

  await prisma.record.deleteMany({
    where: { 
      id: { in: ids },
      organizationId: orgId
    }
  });

  revalidatePath("/dashboard/records");
}

export async function bulkRenewRecords(ids: string[], newExpiry: string) {
  const orgId = await getOrganizationId();

  const expiryDate = new Date(newExpiry);
  const status = getExpiryStatus(expiryDate);

  const records = await prisma.record.findMany({
    where: { id: { in: ids }, organizationId: orgId }
  });

  for (const record of records) {
    await prisma.record.update({
      where: { id: record.id },
      data: { expiryDate, status }
    });

    await prisma.activityLog.create({
      data: {
        action: "Record Renewed (Bulk)",
        details: `Renewed until ${expiryDate.toLocaleDateString()}`,
        recordId: record.id,
      },
    });
  }

  revalidatePath("/dashboard", "layout");
}
