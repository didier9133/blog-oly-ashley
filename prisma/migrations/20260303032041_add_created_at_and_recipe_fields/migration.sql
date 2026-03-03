-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "recipeCookTime" TEXT,
ADD COLUMN     "recipeIngredients" TEXT[],
ADD COLUMN     "recipeInstructions" TEXT[],
ADD COLUMN     "recipePrepTime" TEXT,
ADD COLUMN     "recipeYield" TEXT;
