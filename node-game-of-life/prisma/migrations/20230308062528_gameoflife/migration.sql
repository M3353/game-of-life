-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "board" JSONB NOT NULL,
    "occupied" JSONB NOT NULL,
    "rows" SMALLINT NOT NULL,
    "columns" SMALLINT NOT NULL,
    "ready" BOOLEAN,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);
