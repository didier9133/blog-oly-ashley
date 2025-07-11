/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug_es]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug_en]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug_en` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug_es` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_en` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_es` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Post_slug_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
DROP COLUMN "slug",
DROP COLUMN "title",
ADD COLUMN     "content_en" TEXT,
ADD COLUMN     "content_es" TEXT,
ADD COLUMN     "slug_en" TEXT NOT NULL,
ADD COLUMN     "slug_es" TEXT NOT NULL,
ADD COLUMN     "title_en" TEXT NOT NULL,
ADD COLUMN     "title_es" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_es_key" ON "Post"("slug_es");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_en_key" ON "Post"("slug_en");

-- CreateIndex
CREATE INDEX "Post_slug_es_idx" ON "Post"("slug_es");

-- CreateIndex
CREATE INDEX "Post_slug_en_idx" ON "Post"("slug_en");
