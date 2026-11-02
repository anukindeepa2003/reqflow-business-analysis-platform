-- AlterTable
ALTER TABLE "requirements"
ADD COLUMN "next_acceptance_criterion_number" INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT "requirements_next_acceptance_criterion_number_check"
CHECK ("next_acceptance_criterion_number" >= 1);

-- CreateTable
CREATE TABLE "acceptance_criteria" (
    "id" UUID NOT NULL,
    "requirement_id" UUID NOT NULL,
    "sequence_number" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "acceptance_criteria_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "acceptance_criteria_sequence_number_check" CHECK ("sequence_number" >= 1),
    CONSTRAINT "acceptance_criteria_position_check" CHECK ("position" >= 1),
    CONSTRAINT "acceptance_criteria_description_length_check"
        CHECK (char_length("description") BETWEEN 5 AND 2000),
    CONSTRAINT "acceptance_criteria_description_trimmed_check"
        CHECK ("description" = btrim("description"))
);

-- CreateIndex
CREATE UNIQUE INDEX "acceptance_criteria_requirement_sequence_key" ON "acceptance_criteria"("requirement_id", "sequence_number");

-- CreateIndex
CREATE UNIQUE INDEX "acceptance_criteria_requirement_position_key" ON "acceptance_criteria"("requirement_id", "position");

-- AddForeignKey
ALTER TABLE "acceptance_criteria" ADD CONSTRAINT "acceptance_criteria_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
