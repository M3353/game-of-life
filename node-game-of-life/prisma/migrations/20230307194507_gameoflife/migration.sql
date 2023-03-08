-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "board" INTEGER[],
    "occupied" INTEGER[],
    "rows" SMALLINT NOT NULL,
    "columns" SMALLINT NOT NULL,
    "ready" BOOLEAN,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);
