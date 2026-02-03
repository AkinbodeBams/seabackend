import prisma from "../../lib/prisma";
import { signUpdataPayload } from "../../types";

export async function createAccount(data: signUpdataPayload) {
  console.log("dbbbbbb");

  return prisma.$transaction(async (tx) => {
    // Create account
    const account = await tx.account.create({
      data: {
        email: data.email,
        password: data.password,
        type: data.type,
      },
    });

    // Create profile
    await tx.profile.create({
      data: {
        accountId: account.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber.value,
        countryCode: data.phoneNumber.countryCode,
      },
    });

    // Create role-specific record
    if (account.type === "SEAFARER") {
      await tx.seafarer.create({
        data: { accountId: account.id },
      });
    } else {
      await tx.therapist.create({
        data: { accountId: account.id },
      });
    }

    // ✅ return account from transaction
    return account;
  });
}

export async function findAccountByEmail(email: string) {
  const account = await prisma.account.findUnique({
    where: { email },
    include: {
      seafarer: true,
      therapist: true,
      profile: true,
    },
  });
  return account;
}
