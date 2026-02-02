/*
  Warnings:

  - You are about to drop the column `suspended` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "suspended",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "phone",
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "phoneNumber" TEXT;
