-- DropIndex
DROP INDEX "Contact_email_createdAt_idx";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "phone" TEXT;
