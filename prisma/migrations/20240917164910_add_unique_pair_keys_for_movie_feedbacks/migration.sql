/*
  Warnings:

  - The primary key for the `MovieFeedback` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MovieFeedback` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[movie_id,user_id]` on the table `MovieFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MovieFeedback" DROP CONSTRAINT "MovieFeedback_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "MovieFeedback_movie_id_user_id_key" ON "MovieFeedback"("movie_id", "user_id");
