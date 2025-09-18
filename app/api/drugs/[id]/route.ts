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
      return NextResponse.json({ error: 'Drug not found: ' + (error?.message || 'Unknown') }, { status: 404 });
    }

    // Normalize data to ensure consistent structure
    const normalizedDrug = {
      ...data,
      brandNames: Array.isArray(data.brandNames) ? data.brandNames : [],
      warnings: Array.isArray(data.warnings) ? data.warnings : [],
      contraindications: Array.isArray(data.contraindications) ? data.contraindications : [],
      interactions: Array.isArray(data.interactions) ? data.interactions : [],
      monitoring: Array.isArray(data.monitoring) ? data.monitoring : [],
      sideEffects: data.sideEffects && typeof data.sideEffects === 'object' && 'common' in data.sideEffects
        ? data.sideEffects
        : { common: [], serious: [], rare: [] },
      dosageGuidelines: {
        mgPerKg: data.dosageGuidelines?.mgPerKg || data.dosageGuidelines?.weight_based || 'Not specified',
        mgPerM2: data.dosageGuidelines?.mgPerM2 || 'Not typically calculated by BSA',
        maxDaily: data.dosageGuidelines?.maxDaily || data.dosageGuidelines?.max_daily || 'Not specified',
        routes: Array.isArray(JSON.parse(data.dosageGuidelines?.routes)) ? data.dosageGuidelines.routes : ['Unknown'],
        frequency: data.dosageGuidelines?.frequency || data.dosageGuidelines?.age_based || data.dosageGuidelines?.duration || 'As prescribed',
        ...data.dosageGuidelines, // Preserve other fields
      },
      status: data.status || 'active',
      mechanism: data.mechanism || '',
      storage: data.storage || '',
    };


// console.log(normalizedDrug)

    return NextResponse.json(normalizedDrug);
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error.message || 'Unknown') }, { status: 500 });
  }
}

// PUT /api/drugs/[id] - Update a drug
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Normalize input data
    const drugData = {
      name: body.name || '',
      genericName: body.genericName || '',
      brandNames: Array.isArray(body.brandNames) ? body.brandNames : [],
      category: body.category || '',
      dosageForm: body.dosageForm || '',
      concentration: body.concentration || '',
      indication: body.indication || '',
      ageRange: body.ageRange || '',
      dosageGuidelines: {
        mgPerKg: body.dosageGuidelines?.mgPerKg || body.dosageGuidelines?.weight_based || 'Not specified',
        mgPerM2: body.dosageGuidelines?.mgPerM2 || 'Not typically calculated by BSA',
        maxDaily: body.dosageGuidelines?.maxDaily || body.dosageGuidelines?.max_daily || 'Not specified',
        routes: Array.isArray(body.dosageGuidelines?.routes) ? body.dosageGuidelines.routes : ['Unknown'],
        frequency: body.dosageGuidelines?.frequency || body.dosageGuidelines?.age_based || body.dosageGuidelines?.duration || 'As prescribed',
        ...body.dosageGuidelines, // Preserve other fields
      },
      warnings: Array.isArray(body.warnings) ? body.warnings : [],
      contraindications: Array.isArray(body.contraindications) ? body.contraindications : [],
      sideEffects: body.sideEffects && typeof body.sideEffects === 'object' && 'common' in body.sideEffects
        ? body.sideEffects
        : { common: [], serious: [], rare: [] },
      interactions: Array.isArray(body.interactions) ? body.interactions : [],
      status: body.status || 'active',
      mechanism: body.mechanism || '',
      monitoring: Array.isArray(body.monitoring) ? body.monitoring : [],
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
      return NextResponse.json({ error: 'Failed to update drug: ' + (error?.message || 'Unknown') }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error.message || 'Unknown') }, { status: 500 });
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
      return NextResponse.json({ error: 'Failed to delete drug: ' + error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Drug deleted successfully' });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error.message || 'Unknown') }, { status: 500 });
  }
}