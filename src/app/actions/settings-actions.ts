"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

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

export async function updateProfile(data: { name: string, email: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      email: data.email,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateOrganization(data: { name: string }) {
  const orgId = await getOrganizationId();

  await prisma.organization.update({
    where: { id: orgId },
    data: { name: data.name },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updatePassword(password: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const hashedPassword = await bcrypt.hash(password, 10);
  
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}
