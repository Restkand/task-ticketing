/*
  Warnings:

  - Added the required column `dueDate` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;
