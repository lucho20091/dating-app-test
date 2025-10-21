/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Test2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Test";

-- DropTable
DROP TABLE "public"."Test2";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT 'male',
    "age" INTEGER NOT NULL DEFAULT 18,
    "bio" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "preferences" TEXT NOT NULL DEFAULT 'female',
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
