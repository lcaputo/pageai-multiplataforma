-- CreateTable
CREATE TABLE "Posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "numOfBedrooms" INTEGER NOT NULL,
    "numOfBathrooms" INTEGER NOT NULL,
    "provice" TEXT NOT NULL,
    "Population" INTEGER NOT NULL,
    "longitude" REAL NOT NULL,
    "latitude" REAL NOT NULL
);
