import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('doomifiles') // Make sure this bucket exists in your Supabase project
      .upload(filePath, file);

    if (error) {
      console.error('Supabase upload error:', error);
      return new NextResponse('Failed to upload file to Supabase', { status: 500 });
    }

    const { data } = supabase.storage
      .from('doomifiles')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error('[UPLOAD_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

