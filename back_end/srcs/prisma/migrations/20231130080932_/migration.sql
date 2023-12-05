-- CreateEnum
CREATE TYPE "ChatMode" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "loose" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 2000,
ADD COLUMN     "win" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Direct" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Direct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "password" TEXT,
    "mode" "ChatMode" NOT NULL DEFAULT 'PUBLIC',
    "ownerId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievments" (
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Achievments_title_key" ON "Achievments"("title");
