import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET /api/drugs - Fetch all drugs with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();
    const category = searchParams.get('category');

    let query = supabase.from('drugs').select('*');

    if (search) {
      query = query.or(`name.ilike.%${search}%,genericName.ilike.%${search}%,brandNames.cs.{${search}},indication.ilike.%${search}%`);
    }

    if (category && category !== 'All Categories') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch drugs' }, { status: 500 });
    }

    // console.log(data)

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/drugs - Create a new drug
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const drugData = {
      name: body.name,
      genericName: body.genericName,
      brandNames: body.brandNames || [],
      category: body.category,
      dosageForm: body.dosageForm,
      concentration: body.concentration,
      indication: body.indication,
      ageRange: body.ageRange,
      dosageGuidelines: body.dosageGuidelines,
      warnings: body.warnings || [],
      contraindications: body.contraindications || [],
      sideEffects: body.sideEffects || [],
      interactions: body.interactions || [],
      status: body.status || 'active',
    };

    const { data, error } = await supabase
      .from('drugs')
      .insert([drugData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create drug' }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}