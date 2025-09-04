import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET: List all patients
export async function GET() {
  const { data, error } = await supabase.from('patients').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Add a new patient
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from('patients').insert([body]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH: Edit a patient (expects id in body)
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updateFields } = body;
  if (!id) return NextResponse.json({ error: 'Missing patient id' }, { status: 400 });
  const { data, error } = await supabase.from('patients').update(updateFields).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE: Delete a patient (expects id in body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing patient id' }, { status: 400 });
  const { error } = await supabase.from('patients').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
