/*
  Warnings:

  - You are about to drop the `GroupsMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupsMembers" DROP CONSTRAINT "GroupsMembers_assignedById_fkey";

-- DropForeignKey
ALTER TABLE "GroupsMembers" DROP CONSTRAINT "GroupsMembers_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupsMembers" DROP CONSTRAINT "GroupsMembers_userId_fkey";

-- DropTable
DROP TABLE "GroupsMembers";

-- CreateTable
CREATE TABLE "GroupMember" (
    "role" "Role" NOT NULL DEFAULT E'USER',
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" TEXT NOT NULL,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("groupId","userId")
);

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
