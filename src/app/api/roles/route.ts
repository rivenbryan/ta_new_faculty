import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // Ensure you have the correct path to your auth configuration
import { Session } from "next-auth";
import { supabase, supabaseAdmin } from "@/app/utils/supabaseClient";
import { DATABASE_USER } from "@/app/utils/constant";

export async function POST(req: Request) {
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { role } = await req.json();

  const {error} = await supabase
    .from(DATABASE_USER)
    .upsert({ name: session.user.name, email: session.user.email, role: role})

  if (error) {
    return NextResponse.json({ error: "Failed to set role" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
