-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "delivery" TEXT,
ADD COLUMN     "deliveryFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "payment" TEXT,
ADD COLUMN     "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0;
