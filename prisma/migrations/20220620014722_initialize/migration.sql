-- CreateTable
CREATE TABLE "airline" (
    "code" VARCHAR(2) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "airline_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "flight" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "airline_code" VARCHAR(2),
    "flight_number" INTEGER,
    "departure_airport_code" VARCHAR(3),
    "departure_timestamp" TIMESTAMP(6),
    "arrival_airport_code" VARCHAR(3),
    "arrival_timestamp" TIMESTAMP(6),
    "departure_timezone_name" VARCHAR(64) DEFAULT E'Etc/UTC',
    "arrival_timezone_name" VARCHAR(64) DEFAULT E'Etc/UTC',
    "confirmation_number" VARCHAR(6),

    CONSTRAINT "flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stay" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "checkin_timestamp" TIMESTAMP(6),
    "checkout_timestamp" TIMESTAMP(6),
    "name" VARCHAR(255),
    "address" VARCHAR(255),
    "confirmation_number" VARCHAR(255),
    "timezone_name" VARCHAR(64),

    CONSTRAINT "stay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airport" (
    "code" VARCHAR(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "latitude" DECIMAL(6,4),
    "longitude" DECIMAL(7,4),

    CONSTRAINT "airport_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "timezone" (
    "utc_offset" VARCHAR(6) NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "timezone_pkey" PRIMARY KEY ("utc_offset")
);

-- CreateIndex
CREATE UNIQUE INDEX "flight_uuid" ON "flight"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "trip_uuid" ON "trip"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "stay_uuid" ON "stay"("uuid");

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "fk_flight_airline" FOREIGN KEY ("airline_code") REFERENCES "airline"("code") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "fk_flight_trip" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "fk_flight_arrival_airport" FOREIGN KEY ("arrival_airport_code") REFERENCES "airport"("code") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "fk_flight_departure_airport" FOREIGN KEY ("departure_airport_code") REFERENCES "airport"("code") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stay" ADD CONSTRAINT "fk_stay_trip" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
