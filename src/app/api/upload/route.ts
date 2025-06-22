// app/api/upload/route.ts
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const filePath = `products/${Date.now()}-${file.name}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('doomifiles')
    .upload(filePath, file)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get public URL
  const { data: publicData } = supabase.storage
    .from('doomifiles')
    .getPublicUrl(filePath)

  const imageUrl = publicData?.publicUrl

  return NextResponse.json({ imageUrl })
}
