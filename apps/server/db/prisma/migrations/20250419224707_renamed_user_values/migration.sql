/*
  Warnings:

  - You are about to drop the `USER_VALUES` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "USER_VALUES";

-- CreateTable
CREATE TABLE "UserValues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserValues_pkey" PRIMARY KEY ("id")
);
