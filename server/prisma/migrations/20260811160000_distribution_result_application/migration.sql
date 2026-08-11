-- Distribution results store the winning application; internship and achieved
-- preference are derived from that application.
ALTER TABLE "DistributionResult" DROP CONSTRAINT "DistributionResult_internshipId_fkey";
ALTER TABLE "DistributionResult" DROP COLUMN "internshipId", DROP COLUMN "wishOrder";
ALTER TABLE "DistributionResult" ADD COLUMN "applicationId" UUID;
CREATE UNIQUE INDEX "DistributionResult_applicationId_key" ON "DistributionResult"("applicationId");
ALTER TABLE "DistributionResult" ADD CONSTRAINT "DistributionResult_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
