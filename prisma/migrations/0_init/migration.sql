-- CreateTable
CREATE TABLE "Day" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "training_type" TEXT NOT NULL DEFAULT 'rest',
    "training_notes" TEXT,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo_url" TEXT,
    "kcal" DOUBLE PRECISION NOT NULL,
    "protein_g" DOUBLE PRECISION NOT NULL,
    "carb_g" DOUBLE PRECISION NOT NULL,
    "fat_g" DOUBLE PRECISION NOT NULL,
    "confidence" INTEGER NOT NULL,
    "flags" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnownFood" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serving_g" DOUBLE PRECISION NOT NULL,
    "kcal_per_serving" DOUBLE PRECISION NOT NULL,
    "protein_g" DOUBLE PRECISION NOT NULL,
    "carb_g" DOUBLE PRECISION NOT NULL,
    "fat_g" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,

    CONSTRAINT "KnownFood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Day_date_key" ON "Day"("date");

-- CreateIndex
CREATE INDEX "Meal_day_id_idx" ON "Meal"("day_id");

-- CreateIndex
CREATE UNIQUE INDEX "KnownFood_name_key" ON "KnownFood"("name");

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

