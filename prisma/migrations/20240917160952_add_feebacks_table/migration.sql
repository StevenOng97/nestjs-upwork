/*
  Warnings:

  - The values [GITHUB,FACEBOOK] on the enum `Provider` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `provider_id` on the `OAuthAccount` table. All the data in the column will be lost.
  - Added the required column `status` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterEnum
BEGIN;
CREATE TYPE "Provider_new" AS ENUM ('EMAIL', 'GOOGLE');
ALTER TABLE "OAuthAccount" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TYPE "Provider" RENAME TO "Provider_old";
ALTER TYPE "Provider_new" RENAME TO "Provider";
DROP TYPE "Provider_old";
COMMIT;

-- DropIndex
DROP INDEX "OAuthAccount_provider_provider_id_key";

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "status" "MovieStatus" NOT NULL;

-- AlterTable
ALTER TABLE "OAuthAccount" DROP COLUMN "provider_id";

-- CreateTable
CREATE TABLE "MovieFeedback" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovieFeedback" ADD CONSTRAINT "MovieFeedback_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieFeedback" ADD CONSTRAINT "MovieFeedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
