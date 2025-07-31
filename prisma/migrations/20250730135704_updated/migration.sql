/*
  Warnings:

  - You are about to drop the column `recipientId` on the `Notifications` table. All the data in the column will be lost.
  - Added the required column `recipient_id` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_recipientId_fkey";

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "recipientId",
ADD COLUMN     "recipient_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
