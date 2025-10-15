import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const vendor = searchParams.get('vendor') || '';
    const deviceType = searchParams.get('deviceType') || '';

    // Build where clause for filtering
    const where: any = {};

    if (search) {
      where.OR = [
        { NE_Name: { contains: search, mode: 'insensitive' } },
        { Site_ID: { contains: search, mode: 'insensitive' } },
        { Serial_Number: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (vendor) {
      where.Vendor = { contains: vendor, mode: 'insensitive' };
    }

    if (deviceType) {
      where.Device_Type = { contains: deviceType, mode: 'insensitive' };
    }

    // Get total count for pagination
    const total = await prisma.device_Inventory.count({ where });

    // Get paginated devices
    const devices = await prisma.device_Inventory.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      devices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check for duplicate (NE_Name + Site_ID must be unique)
    const existingDevice = await prisma.device_Inventory.findUnique({
      where: {
        NE_Name_Site_ID: {
          NE_Name: body.NE_Name,
          Site_ID: body.Site_ID,
        },
      },
    });

    if (existingDevice) {
      return NextResponse.json(
        {
          error: 'Device already exists',
          existingDevice,
        },
        { status: 409 }
      );
    }

    const device = await prisma.device_Inventory.create({
      data: {
        ...body,
        Installation_Date: body.Installation_Date
          ? new Date(body.Installation_Date)
          : null,
      },
    });

    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.error('Error creating device:', error);
    return NextResponse.json(
      { error: 'Failed to create device' },
      { status: 500 }
    );
  }
}