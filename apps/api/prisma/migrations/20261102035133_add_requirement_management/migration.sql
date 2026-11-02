-- CreateEnum
CREATE TYPE "requirement_type" AS ENUM ('FUNCTIONAL', 'NON_FUNCTIONAL');

-- CreateEnum
CREATE TYPE "requirement_priority" AS ENUM ('MUST', 'SHOULD', 'COULD', 'WONT');

-- CreateEnum
CREATE TYPE "requirement_status" AS ENUM ('DRAFT', 'READY', 'IN_PROGRESS', 'IMPLEMENTED', 'DEFERRED');

-- AlterTable
ALTER TABLE "projects"
ADD COLUMN "next_requirement_number" INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT "projects_next_requirement_number_check" CHECK ("next_requirement_number" >= 1);

-- CreateTable
CREATE TABLE "requirements" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "sequence_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "requirement_type" NOT NULL,
    "priority" "requirement_priority" NOT NULL,
    "status" "requirement_status" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "requirements_sequence_number_check" CHECK ("sequence_number" >= 1),
    CONSTRAINT "requirements_title_length_check" CHECK (char_length("title") BETWEEN 2 AND 200),
    CONSTRAINT "requirements_title_trimmed_check" CHECK ("title" = btrim("title")),
    CONSTRAINT "requirements_description_length_check" CHECK (char_length("description") BETWEEN 10 AND 5000),
    CONSTRAINT "requirements_description_trimmed_check" CHECK ("description" = btrim("description"))
);

-- CreateIndex
CREATE INDEX "requirements_project_status_updated_idx" ON "requirements"("project_id", "status", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "requirements_project_type_idx" ON "requirements"("project_id", "type");

-- CreateIndex
CREATE INDEX "requirements_project_priority_idx" ON "requirements"("project_id", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "requirements_project_sequence_key" ON "requirements"("project_id", "sequence_number");

-- AddForeignKey
ALTER TABLE "requirements" ADD CONSTRAINT "requirements_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
