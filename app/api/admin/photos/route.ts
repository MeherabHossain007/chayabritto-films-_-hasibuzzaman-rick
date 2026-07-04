import { NextResponse } from 'next/server';
import { uploadFile, createFolder, listAllPhotos, isDriveConnected, listCategories } from '@/lib/google-drive';

export async function GET(request: Request) {
  try {
    if (!isDriveConnected()) {
      return NextResponse.json({ photos: [] });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const photos = await listAllPhotos(category);
    return NextResponse.json({ photos });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch photos';
    console.error('Error fetching photos:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const categorySlug = formData.get('category') as string;
    const folderName = formData.get('folderName') as string | null;
    const files = formData.getAll('files') as File[];

    if (!isDriveConnected()) {
      return NextResponse.json(
        { error: 'Google Drive is not connected. Go to Admin > Settings to connect your Google account first.' },
        { status: 400 }
      );
    }

    if (!categorySlug) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'At least one file is required' },
        { status: 400 }
      );
    }

    // List categories to find the correct folder ID
    const categories = await listCategories();
    const category = categories.find((c) => c.slug === categorySlug);

    if (!category) {
      return NextResponse.json(
        { error: `Category '${categorySlug}' not found in Google Drive. Please seed or create it first.` },
        { status: 404 }
      );
    }

    let targetFolderId = category.driveFolderId;

    // If a subfolder name is provided, create it under the category folder
    if (folderName && folderName.trim()) {
      const subFolder = await createFolder(folderName.trim(), targetFolderId);
      targetFolderId = subFolder.id;
    }

    const uploadedPhotos = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const driveResult = await uploadFile(
        buffer,
        file.name,
        file.type || 'image/jpeg',
        targetFolderId
      );

      uploadedPhotos.push({
        id: driveResult.fileId,
        title: file.name,
        thumbnailLink: driveResult.thumbnailLink,
        categoryName: category.name,
      });
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedPhotos.length,
      photos: uploadedPhotos,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload photos';
    console.error('Error uploading photos:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
