/*
  Warnings:

  - You are about to drop the column `groupId` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[groupId,userId]` on the table `GroupMember` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_groupId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "groupId";

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");
