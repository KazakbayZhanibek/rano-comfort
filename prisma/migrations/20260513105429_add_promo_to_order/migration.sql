-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "promoCode" TEXT;
