import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET /api/prescriptions - Fetch all prescriptions with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let query = supabase.from('prescriptions').select(`
      id,
      patient_id,
      patients!inner (
        name,
        age
      ),
      drug_id,
      drugs!inner (
        name,
        "genericName"
      ),
      dosage,
      quantity,
      route,
      frequency,
      status,
      priority,
      created_at,
      updated_at,
      notes,
      doctor_id,
      profiles!prescriptions_doctor_id_fkey (
        full_name
      )
    `);

    if (search) {
      query = query.or(`patients.name.ilike.%${search}%,drugs.name.ilike.%${search}%,profiles.full_name.ilike.%${search}%`);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
    }

    // Transform the data to match the expected frontend structure
    const transformedData = data?.map(prescription => ({
      ...prescription,
      patients: prescription.patients ? {
        patientName: prescription.patients.name,
        patientAge: prescription.patients.age
      } : null,
      drugs: prescription.drugs ? {
        medication: prescription.drugs.name,
        genericName: prescription.drugs.genericName
      } : null,
      profiles: prescription.profiles ? {
        doctorName: prescription.profiles.full_name
      } : null
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



// POST /api/prescriptions - Create a new prescription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const prescriptionData = {
      patient_id: body.patient_id,
      drug_id: body.drug_id,
      dosage: body.dosage,
      quantity: body.quantity,
      route: body.route,
      frequency: body.frequency,
      notes: body.notes,
      doctor_id: body.doctor_id,  // From localStorage user
      status: 'pending',
      priority: body.priority || 'normal',
    };

    const { data, error } = await supabase
      .from('prescriptions')
      .insert([prescriptionData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create prescription' }, { status: 400 });
    }

    // Add timeline entry for 'created'
    await supabase.from('prescription_timeline').insert({
      prescription_id: data.id,
      event: 'created',
      user_id: body.doctor_id,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}