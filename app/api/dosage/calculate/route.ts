import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient_id, drug_id, route } = body;

    if (!patient_id || !drug_id || !route) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch patient
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, name, age, weight, height, allergies, conditions')
      .eq('id', patient_id)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Fetch drug
    const { data: drug, error: drugError } = await supabase
      .from('drugs')
      .select('id, name, "genericName", category, "dosageGuidelines", warnings, contraindications')
      .eq('id', drug_id)
      .single();

    if (drugError || !drug) {
      return NextResponse.json({ error: 'Drug not found' }, { status: 404 });
    }

    // Dosage calculation logic (replicated from frontend)
    const mgPerKgMatch = drug.dosageGuidelines.weight_based?.match(/(\d+)-?(\d+)?/) || [null, '10', '15'];
    const minDose = parseInt(mgPerKgMatch[1]) || 10;
    const maxDose = parseInt(mgPerKgMatch[2] || mgPerKgMatch[1]) || 15;

    const avgDosePerKg = (minDose + maxDose) / 2;
    const weightBasedDose = avgDosePerKg * patient.weight;

    let bsaBasedDose;
    if (drug.dosageGuidelines.mgPerM2 !== "Not typically calculated by BSA" && patient.height) {
      const bsa = Math.sqrt((patient.height * patient.weight) / 3600);
      const mgPerM2Match = drug.dosageGuidelines.mgPerM2?.match(/(\d+)/) || [null, '500'];
      const dosePerM2 = parseInt(mgPerM2Match[1]) || 500;
      bsaBasedDose = dosePerM2 * bsa;
    }

    const maxDailyMatch = drug.dosageGuidelines.max_daily?.match(/(\d+)/) || [null, '75'];
    const maxDailyPerKg = parseInt(maxDailyMatch[1]) || 75;
    const maxDaily = maxDailyPerKg * patient.weight;

    const recommendedDose = Math.round(weightBasedDose * 10) / 10;

    const warnings: string[] = [];
    let safetyLevel: "safe" | "caution" | "danger" = "safe";

    const hasRelevantAllergy = patient.allergies.some((allergy: string) => {
      if (allergy === "Penicillin" && drug.name.toLowerCase().includes("amoxicillin")) return true;
      if (allergy === "NSAIDs" && drug.category === "NSAIDs") return true;
      return false;
    });

    if (hasRelevantAllergy) {
      warnings.push(`Patient has documented allergy: ${patient.allergies.join(", ")}`);
      safetyLevel = "danger";
    }

    if (recommendedDose > maxDaily) {
      warnings.push("Calculated dose exceeds maximum daily limit");
      safetyLevel = "danger";
    } else if (recommendedDose > maxDaily * 0.8) {
      warnings.push("Dose approaching maximum daily limit - monitor closely");
      safetyLevel = "caution";
    }

    if (patient.age < 2 && drug.category === "NSAIDs") {
      warnings.push("NSAIDs not recommended for children under 2 years");
      safetyLevel = "danger";
    }

    warnings.push(...drug.warnings);

    if (warnings.length > 0 && safetyLevel === "safe") {
      safetyLevel = "caution";
    }

    const result = {
      weightBased: Math.round(weightBasedDose * 10) / 10,
      bsaBased: bsaBasedDose ? Math.round(bsaBasedDose * 10) / 10 : undefined,
      maxDaily: Math.round(maxDaily * 10) / 10,
      recommendedDose,
      route,
      frequency: drug.dosageGuidelines.frequency || 'As needed',
      warnings,
      safetyLevel,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}