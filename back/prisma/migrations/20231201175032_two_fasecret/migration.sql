-- AlterTable
ALTER TABLE "users" ALTER COLUMN "twoFASecret" DROP NOT NULL,
ALTER COLUMN "twoFASecret" DROP DEFAULT;
