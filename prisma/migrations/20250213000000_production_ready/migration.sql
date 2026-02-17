-- Production-ready schema updates
-- 1. Remove redundant wallSlug column (always duplicated slug)
-- 2. Add updatedAt to Project and Form for audit trail
-- 3. Use TEXT for long content in Testimonial (text up to 5000 chars, photoUrl for long CDN URLs)

DROP INDEX IF EXISTS "Project_wallSlug_key";

ALTER TABLE "Project" DROP COLUMN IF EXISTS "wallSlug";
ALTER TABLE "Project" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Form" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Testimonial" ALTER COLUMN "text" TYPE TEXT;
ALTER TABLE "Testimonial" ALTER COLUMN "photoUrl" TYPE TEXT USING "photoUrl"::TEXT;
