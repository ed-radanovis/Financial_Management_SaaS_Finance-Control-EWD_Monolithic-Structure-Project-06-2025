-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionSubcategory" ADD VALUE 'BONUSES';
ALTER TYPE "TransactionSubcategory" ADD VALUE 'THERAPY';
ALTER TYPE "TransactionSubcategory" ADD VALUE 'TOLLS';
ALTER TYPE "TransactionSubcategory" ADD VALUE 'GYM';
ALTER TYPE "TransactionSubcategory" ADD VALUE 'HOBBIES';
