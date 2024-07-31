-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "lineId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StampCard" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "stamps" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StampCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_lineId_key" ON "User"("lineId");

-- AddForeignKey
ALTER TABLE "StampCard" ADD CONSTRAINT "StampCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
