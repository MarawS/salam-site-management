-- CreateTable
CREATE TABLE "site_inventory" (
    "id" TEXT NOT NULL,
    "Site_ID" TEXT NOT NULL,
    "Legacy_Site_ID" TEXT,
    "Site_Group" TEXT,
    "Site_Type" TEXT,
    "Region13" TEXT,
    "Region5" TEXT,
    "City" TEXT,
    "District" TEXT,
    "Latitude" DOUBLE PRECISION,
    "Longitude" DOUBLE PRECISION,
    "Status" TEXT,
    "Operator" TEXT,
    "Owner" TEXT,
    "Installation_Date" TIMESTAMP(3),
    "technician_name" TEXT NOT NULL,
    "technician_email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_inventory" (
    "id" TEXT NOT NULL,
    "NE_Name" TEXT NOT NULL,
    "Site_ID" TEXT NOT NULL,
    "Serial_Number" TEXT,
    "Operator_ID" TEXT,
    "NE_IP_Address" TEXT,
    "NE_MAC_Address" TEXT,
    "Model_Number" TEXT,
    "Vendor" TEXT,
    "Device_Type" TEXT,
    "Equipment_Role" TEXT,
    "Technology" TEXT,
    "Domain" TEXT,
    "Sub_Domain" TEXT,
    "Status" TEXT NOT NULL DEFAULT 'Active',
    "Installation_Date" TIMESTAMP(3),
    "technician_name" TEXT NOT NULL,
    "technician_email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_inventory" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_inventory_Site_ID_key" ON "site_inventory"("Site_ID");

-- CreateIndex
CREATE INDEX "site_inventory_Site_ID_idx" ON "site_inventory"("Site_ID");

-- CreateIndex
CREATE INDEX "site_inventory_Region5_idx" ON "site_inventory"("Region5");

-- CreateIndex
CREATE INDEX "site_inventory_City_idx" ON "site_inventory"("City");

-- CreateIndex
CREATE INDEX "device_inventory_NE_Name_idx" ON "device_inventory"("NE_Name");

-- CreateIndex
CREATE INDEX "device_inventory_Site_ID_idx" ON "device_inventory"("Site_ID");

-- CreateIndex
CREATE INDEX "device_inventory_Device_Type_idx" ON "device_inventory"("Device_Type");

-- CreateIndex
CREATE INDEX "device_inventory_Vendor_idx" ON "device_inventory"("Vendor");

-- CreateIndex
CREATE UNIQUE INDEX "device_inventory_NE_Name_Site_ID_key" ON "device_inventory"("NE_Name", "Site_ID");

-- AddForeignKey
ALTER TABLE "device_inventory" ADD CONSTRAINT "device_inventory_Site_ID_fkey" FOREIGN KEY ("Site_ID") REFERENCES "site_inventory"("Site_ID") ON DELETE RESTRICT ON UPDATE CASCADE;
