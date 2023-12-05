-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isTwoFAEnable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFASecret" TEXT NOT NULL DEFAULT '';
