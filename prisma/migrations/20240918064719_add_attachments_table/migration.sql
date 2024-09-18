-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('MOVIE', 'USER');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "poster" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Attachment" (
    "url" TEXT NOT NULL,
    "resource_id" INTEGER NOT NULL,
    "resource_type" "ResourceType" NOT NULL,
    "attachment_type" "AttachmentType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_resource_id_resource_type_attachment_type_key" ON "Attachment"("resource_id", "resource_type", "attachment_type");
