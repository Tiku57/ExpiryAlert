"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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

export async function getNotifications() {
  const orgId = await getOrganizationId();
  return prisma.notification.findMany({
    where: { record: { organizationId: orgId } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
}

export async function markNotificationRead(id: string) {
  const orgId = await getOrganizationId();
  
  // Verify notification belongs to org
  const notif = await prisma.notification.findUnique({
    where: { id },
    include: { record: true }
  });
  
  if (notif?.record?.organizationId !== orgId && notif?.recordId) {
    throw new Error("Unauthorized");
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  revalidatePath("/");
}

export async function markAllNotificationsRead() {
  const orgId = await getOrganizationId();

  const notifications = await prisma.notification.findMany({
    where: {
      isRead: false,
      record: {
        organizationId: orgId
      }
    }
  });

  if (notifications.length > 0) {
    await prisma.notification.updateMany({
      where: {
        id: { in: notifications.map(n => n.id) }
      },
      data: { isRead: true }
    });
  }
  
  revalidatePath("/");
}

export async function dismissNotification(id: string) {
  const orgId = await getOrganizationId();
  
  const notif = await prisma.notification.findUnique({
    where: { id },
    include: { record: true }
  });
  
  if (notif?.record?.organizationId !== orgId && notif?.recordId) {
    throw new Error("Unauthorized");
  }

  await prisma.notification.delete({
    where: { id },
  });

  revalidatePath("/");
}
