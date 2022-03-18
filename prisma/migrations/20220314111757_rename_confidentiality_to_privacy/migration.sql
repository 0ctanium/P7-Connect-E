/*
  Warnings:

  - You are about to drop the column `confidentiality` on the `Group` table. All the data in the column will be lost.
  - Added the required column `privacy` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GroupPrivacy" AS ENUM ('OPEN', 'CLOSED', 'SECRET');

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "confidentiality",
ADD COLUMN     "privacy" "GroupPrivacy" NOT NULL;

-- DropEnum
DROP TYPE "GroupConfidentiality";
