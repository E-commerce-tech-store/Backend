-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('FINISHED', 'PENDING');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "tbl_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_order_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_product" UUID NOT NULL,
    "id_order" UUID NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "subtotal" DECIMAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_price" DECIMAL NOT NULL,

    CONSTRAINT "tbl_order_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_user" UUID NOT NULL,
    "total" DECIMAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "order_status" NOT NULL,

    CONSTRAINT "tbl_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "stock" DECIMAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "price" DECIMAL NOT NULL,
    "image_url" VARCHAR NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" "role" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_categories_name_key" ON "tbl_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_email_key" ON "tbl_user"("email");

-- AddForeignKey
ALTER TABLE "tbl_order_details" ADD CONSTRAINT "tbl_order_details_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "tbl_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_order_details" ADD CONSTRAINT "tbl_order_details_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "tbl_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_orders" ADD CONSTRAINT "tbl_orders_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "tbl_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_products" ADD CONSTRAINT "tbl_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tbl_categories"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
