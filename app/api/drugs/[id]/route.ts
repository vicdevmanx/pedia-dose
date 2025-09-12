import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET /api/drugs/[id] - Fetch a single drug
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from('drugs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Drug not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/drugs/[id] - Update a drug
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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
      sideEffects: body.sideEffects || { common: [], serious: [], rare: [] },
      interactions: body.interactions || [],
      status: body.status || 'active',
      mechanism: body.mechanism || '',
      monitoring: body.monitoring || [],
      storage: body.storage || '',
    };

    const { data, error } = await supabase
      .from('drugs')
      .update(drugData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update drug' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/drugs/[id] - Delete a drug
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('drugs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete drug' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Drug deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}