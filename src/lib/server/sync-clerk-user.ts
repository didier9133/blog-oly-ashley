import { currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export type ClerkUserIdentity = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  image?: string | null;
};

export async function syncClerkUser(identity: ClerkUserIdentity) {
  const normalizedEmail = identity.email.trim().toLowerCase();
  const profile = {
    email: normalizedEmail,
    firstName: identity.firstName?.trim() ?? "",
    lastName: identity.lastName?.trim() ?? "",
    image: identity.image ?? "",
  };

  const [userById, userByEmail] = await Promise.all([
    prisma.user.findUnique({ where: { id: identity.id } }),
    prisma.user.findUnique({ where: { email: normalizedEmail } }),
  ]);

  if (!userByEmail || userByEmail.id === identity.id) {
    return prisma.user.upsert({
      where: { id: identity.id },
      create: {
        id: identity.id,
        ...profile,
      },
      update: profile,
    });
  }

  const queries = [];

  if (!userById) {
    queries.push(
      prisma.user.create({
        data: {
          id: identity.id,
          email: `${identity.id}@clerk-sync.invalid`,
          firstName: profile.firstName,
          lastName: profile.lastName,
          image: profile.image,
        },
      }),
    );
  }

  queries.push(
    prisma.post.updateMany({
      where: { authorId: userByEmail.id },
      data: { authorId: identity.id },
    }),
    prisma.user.delete({ where: { id: userByEmail.id } }),
    prisma.user.update({
      where: { id: identity.id },
      data: profile,
    }),
  );

  await prisma.$transaction(queries);

  return prisma.user.findUniqueOrThrow({ where: { id: identity.id } });
}

export async function ensureCurrentUserIsSynced() {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const primaryEmail =
    user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    )?.emailAddress ?? user.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    throw new Error("The authenticated account has no email address");
  }

  return syncClerkUser({
    id: user.id,
    email: primaryEmail,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.imageUrl,
  });
}
