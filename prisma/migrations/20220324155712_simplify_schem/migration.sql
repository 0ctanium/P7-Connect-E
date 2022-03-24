/*
  Warnings:

  - You are about to drop the column `archived` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `everyOneCanApproveMembers` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `official` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `onlyAdminCanPublish` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `postNeedToBeApproved` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `privacy` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the `GroupMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_assignedById_fkey";

-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_userId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "archived",
DROP COLUMN "everyOneCanApproveMembers",
DROP COLUMN "official",
DROP COLUMN "onlyAdminCanPublish",
DROP COLUMN "postNeedToBeApproved",
DROP COLUMN "privacy",
ADD COLUMN     "restricted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "GroupMember";

-- DropEnum
DROP TYPE "GroupPrivacy";
