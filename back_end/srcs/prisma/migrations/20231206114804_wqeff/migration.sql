-- CreateEnum
CREATE TYPE "ChatMode" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hashedRt" TEXT,
    "isTwoFAEnable" BOOLEAN NOT NULL DEFAULT false,
    "twoFASecret" TEXT,
    "score" INTEGER NOT NULL DEFAULT 2000,
    "win" INTEGER NOT NULL DEFAULT 0,
    "loose" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Achievments_title_key" ON "Achievments"("title");
