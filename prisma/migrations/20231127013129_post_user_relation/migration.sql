/*
  Warnings:

  - Added the required column `userId` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "numOfBedrooms" INTEGER NOT NULL,
    "numOfBathrooms" INTEGER NOT NULL,
    "provice" TEXT NOT NULL,
    "Population" INTEGER NOT NULL,
    "longitude" REAL NOT NULL,
    "latitude" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Posts" ("Population", "address", "city", "id", "latitude", "longitude", "numOfBathrooms", "numOfBedrooms", "price", "provice") SELECT "Population", "address", "city", "id", "latitude", "longitude", "numOfBathrooms", "numOfBedrooms", "price", "provice" FROM "Posts";
DROP TABLE "Posts";
ALTER TABLE "new_Posts" RENAME TO "Posts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
