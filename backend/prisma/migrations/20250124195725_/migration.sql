-- CreateTable
CREATE TABLE "Picture" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "initials" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "attempts" INTEGER,
    "misses" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Picture_name_key" ON "Picture"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Picture_url_key" ON "Picture"("url");

-- CreateIndex
CREATE UNIQUE INDEX "User_initials_key" ON "User"("initials");

-- CreateIndex
CREATE UNIQUE INDEX "Score_userId_key" ON "Score"("userId");

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
