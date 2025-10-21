-- CreateTable
CREATE TABLE "Test2" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "lowStockAt" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Test2_sku_key" ON "Test2"("sku");

-- CreateIndex
CREATE INDEX "Test2_userId_name_idx" ON "Test2"("userId", "name");

-- CreateIndex
CREATE INDEX "Test2_createdAt_idx" ON "Test2"("createdAt");
