import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET /api/med-schedules - Fetch medication schedules (dispensed prescriptions with administration events)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();

    let query = supabase.from('prescriptions').select(`
      id,
      patient_id,
      patients (name as patient, age),
      drug_id,
      drugs (name as medication),
      dosage as dose,
      route,
      frequency,  -- Use frequency to derive 'time' in frontend if needed
      status,
      doctor_id,
      profiles (full_name as prescribedBy),
      notes
    `).in('status', ['dispensed', 'administered']);  // For schedules

    if (search) {
      query = query.or(`patients.name.ilike.%${search}%,drugs.name.ilike.%${search}%`);
    }

    const { data: prescriptions, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch med schedules' }, { status: 500 });
    }

    // Derive schedules from prescriptions (add 'time' and administration status from timeline if needed)
    const schedules = await Promise.all(prescriptions.map(async (pres) => {
      const { data: timeline } = await supabase
        .from('prescription_timeline')
        .select('event, created_at')
        .eq('prescription_id', pres.id)
        .order('created_at', { ascending: false })
        .limit(1);  // Latest event for status

      const latestEvent = timeline[0];
      const status = latestEvent?.event === 'administered' ? 'completed' : pres.status === 'dispensed' ? 'pending' : 'overdue';  // Logic for status

      return {
        id: pres.id,
        patient: pres.patient,
        age: pres.age,
        medication: pres.medication,
        dose: pres.dose,
        route: pres.route,
        time: 'Derived from frequency or timeline',  // Frontend can derive or hardcode; adjust if needed
        status,
        prescribedBy: pres.prescribedBy,
        notes: pres.notes,
      };
    }));

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/med-schedules/administer - Mark administration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prescription_id, notes, side_effects, user_id } = body;

    if (!prescription_id) {
      return NextResponse.json({ error: 'Missing prescription ID' }, { status: 400 });
    }

    const updateData = {
      status: 'administered',
      administration_notes: notes,
      side_effects: side_effects || [],
      nurse_id: user_id,
    };

    const { data, error } = await supabase
      .from('prescriptions')
      .update(updateData)
      .eq('id', prescription_id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to administer' }, { status: 400 });
    }

    // Add timeline entry
    await supabase.from('prescription_timeline').insert({
      prescription_id,
      event: 'administered',
      notes,
      user_id,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}