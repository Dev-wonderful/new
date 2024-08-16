/*
  Warnings:

  - Added the required column `expiringAt` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tokens" ADD COLUMN     "expiringAt" TIMESTAMP(3) NOT NULL;
