import { NextResponse } from 'next/server';
import { listAllPhotos, listCategories, isDriveConnected } from '@/lib/google-drive';

export async function GET(request: Request) {
  try {
    if (!isDriveConnected()) {
      return NextResponse.json({
        photos: [],
        categories: ['All', 'Wedding', 'Corporate', 'Cultural', 'Street']
      });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    // List all photos filtered by category if requested
    const drivePhotos = await listAllPhotos(category);

    const photos = drivePhotos.map((photo) => ({
      id: photo.id,
      image: photo.thumbnailLink || photo.webContentLink,
      category: photo.categoryName,
    }));

    // Get all categories dynamically from Google Drive
    const driveCategories = await listCategories();
    const categories = ['All', ...driveCategories.map((c) => c.name)];

    return NextResponse.json({ photos, categories });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { photos: [], categories: ['All', 'Wedding', 'Corporate', 'Cultural', 'Street'] },
      { status: 200 }
    );
  }
}
