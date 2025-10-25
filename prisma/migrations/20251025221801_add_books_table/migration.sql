-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "slug_en" TEXT NOT NULL,
    "slug_es" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_es" TEXT NOT NULL,
    "subtitle_en" TEXT NOT NULL,
    "subtitle_es" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    "discount" INTEGER,
    "coverImage_en" TEXT NOT NULL,
    "coverImage_es" TEXT NOT NULL,
    "s3Key_en" TEXT NOT NULL,
    "s3Key_es" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_es" TEXT NOT NULL,
    "features_en" TEXT[],
    "features_es" TEXT[],
    "pages" INTEGER NOT NULL,
    "format_en" TEXT NOT NULL,
    "format_es" TEXT NOT NULL,
    "language_en" TEXT NOT NULL,
    "language_es" TEXT NOT NULL,
    "isbn" TEXT,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "featured_review_en" TEXT,
    "featured_review_es" TEXT,
    "reviewerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_en_key" ON "Book"("slug_en");

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_es_key" ON "Book"("slug_es");

-- CreateIndex
CREATE INDEX "Book_author_idx" ON "Book"("author");
