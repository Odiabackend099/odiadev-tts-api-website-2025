-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "scopes" JSONB NOT NULL DEFAULT [],
    "domainAllow" JSONB NOT NULL DEFAULT [],
    "ratePerMin" INTEGER NOT NULL DEFAULT 60,
    "dailyQuota" INTEGER NOT NULL DEFAULT 2000,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "revokedAt" DATETIME,
    "lastUsedAt" DATETIME,
    "usageDay" INTEGER NOT NULL DEFAULT 0,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" TEXT,
    "action" TEXT NOT NULL,
    "payload" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_prefix_key" ON "ApiKey"("prefix");
