-- ============================================================
-- A-FRAME KG — Manual Migration SQL
-- Создание всех 21 таблиц для PostgreSQL
-- ============================================================

-- ENUMS
CREATE TYPE "Role" AS ENUM ('USER', 'OWNER', 'ADMIN');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');
CREATE TYPE "CabinStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'BLOCKED', 'ARCHIVED');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED');
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'PUBLISHED', 'HIDDEN');
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FIXED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "phone" VARCHAR(30),
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "avatar_url" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. OWNER_PROFILES
-- ============================================================
CREATE TABLE "owner_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL UNIQUE,
    "business_name" VARCHAR(255),
    "description" TEXT,
    "contact_phone" VARCHAR(30),
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- ============================================================
-- 3. REGIONS
-- ============================================================
CREATE TABLE "regions" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "slug" VARCHAR(100) NOT NULL UNIQUE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. LOCATIONS
-- ============================================================
CREATE TABLE "locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "region_id" INTEGER NOT NULL,
    "city" VARCHAR(150),
    "village" VARCHAR(150),
    "address" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE CASCADE
);

-- ============================================================
-- 5. CABINS
-- ============================================================
CREATE TABLE "cabins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT,
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "max_guests" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "beds" INTEGER NOT NULL DEFAULT 1,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 0,
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "status" "CabinStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE,
    FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE
);

-- ============================================================
-- 6. CABIN_IMAGES
-- ============================================================
CREATE TABLE "cabin_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cabin_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "alt_text" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE
);

-- ============================================================
-- 7. AMENITIES
-- ============================================================
CREATE TABLE "amenities" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "slug" VARCHAR(100) NOT NULL UNIQUE,
    "icon" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- ============================================================
-- 8. CABIN_AMENITIES
-- ============================================================
CREATE TABLE "cabin_amenities" (
    "cabin_id" TEXT NOT NULL,
    "amenity_id" INTEGER NOT NULL,
    PRIMARY KEY ("cabin_id", "amenity_id"),
    FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE,
    FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE CASCADE
);

-- ============================================================
-- 9. CABIN_RULES
-- ============================================================
CREATE TABLE "cabin_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cabin_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE
);

-- ============================================================
-- 10. FAVORITES
-- ============================================================
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "cabin_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("user_id", "cabin_id"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE
);

-- ============================================================
-- 11. BOOKINGS
-- ============================================================
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "booking_number" VARCHAR(30) NOT NULL UNIQUE,
    "user_id" TEXT NOT NULL,
    "cabin_id" TEXT NOT NULL,
    "check_in" DATE NOT NULL,
    "check_out" DATE NOT NULL,
    "guests_count" INTEGER NOT NULL,
    "guest_name" VARCHAR(200) NOT NULL,
    "guest_phone" VARCHAR(30) NOT NULL,
    "guest_email" VARCHAR(255) NOT NULL,
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "nights" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "service_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "cancellation_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE
);

-- ============================================================
-- 12. CABIN_AVAILABILITY
-- ============================================================
CREATE TABLE "cabin_availability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cabin_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "price" DECIMAL(10,2),
    "note" TEXT,
    UNIQUE ("cabin_id", "date"),
    FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE
);

-- ============================================================
-- 13. REVIEWS
-- ============================================================
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "cabin_id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL UNIQUE,
    "rating" INTEGER NOT NULL,
    "text" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE,
    FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE
);

-- ============================================================
-- 14. REVIEW_IMAGES
-- ============================================================
CREATE TABLE "review_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "review_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE
);

-- ============================================================
-- 15. NOTIFICATIONS
-- ============================================================
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "booking_id" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- ============================================================
-- 16. SEARCH_HISTORY
-- ============================================================
CREATE TABLE "search_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "region_id" INTEGER,
    "check_in" DATE,
    "check_out" DATE,
    "guests_count" INTEGER,
    "min_price" DECIMAL(10,2),
    "max_price" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL
);

-- ============================================================
-- 17. PROMOTIONS
-- ============================================================
CREATE TABLE "promotions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cabin_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" DECIMAL(10,2) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE
);

-- ============================================================
-- 18. PAYMENTS
-- ============================================================
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'KGS',
    "payment_method" VARCHAR(50) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transaction_id" VARCHAR(255) UNIQUE,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- ============================================================
-- 19. CABIN_VIEWS
-- ============================================================
CREATE TABLE "cabin_views" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cabin_id" TEXT NOT NULL,
    "user_id" TEXT,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
);

-- ============================================================
-- 20. OWNER_PAYOUTS
-- ============================================================
CREATE TABLE "owner_payouts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner_id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL UNIQUE,
    "gross_amount" DECIMAL(10,2) NOT NULL,
    "commission_amount" DECIMAL(10,2) NOT NULL,
    "net_amount" DECIMAL(10,2) NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE,
    FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE
);

-- ============================================================
-- 21. AUDIT_LOGS
-- ============================================================
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" TEXT,
    "old_data" JSONB,
    "new_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- ============================================================
-- INDEXES для оптимизации
-- ============================================================
CREATE INDEX "idx_cabins_owner" ON "cabins"("owner_id");
CREATE INDEX "idx_cabins_location" ON "cabins"("location_id");
CREATE INDEX "idx_cabins_status" ON "cabins"("status");
CREATE INDEX "idx_bookings_user" ON "bookings"("user_id");
CREATE INDEX "idx_bookings_cabin" ON "bookings"("cabin_id");
CREATE INDEX "idx_bookings_status" ON "bookings"("status");
CREATE INDEX "idx_bookings_dates" ON "bookings"("check_in", "check_out");
CREATE INDEX "idx_reviews_cabin" ON "reviews"("cabin_id");
CREATE INDEX "idx_reviews_user" ON "reviews"("user_id");
CREATE INDEX "idx_favorites_user" ON "favorites"("user_id");
CREATE INDEX "idx_cabin_availability_cabin_date" ON "cabin_availability"("cabin_id", "date");

-- ============================================================
-- Готово! Все 21 таблица созданы
-- ============================================================
