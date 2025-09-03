import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key"; // put in .env

export async function POST(req: Request) {
  try {
    const { fullName, email, password, role } = await req.json();

    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    if (existingUserError && existingUserError.code !== "PGRST116") {
      // Ignore "No rows found" error (PGRST116), handle others
      return NextResponse.json(
        { error: existingUserError.message },
        { status: 500 }
      );
    }

    // 1. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Insert user into profiles table
    const { data, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          full_name: fullName,
          email,
          password: hashedPassword, // store hashed password
          role,
        },
      ])
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    // 3. Generate JWT
    const token = jwt.sign(
      {
        id: data.id,
        email: data.email,
        role: data.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "User created and signed in successfully!",
        user: {
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          role: data.role,
        },
        token, // send JWT to client
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
