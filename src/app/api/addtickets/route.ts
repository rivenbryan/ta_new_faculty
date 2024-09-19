// /app/api/students-by-ta/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  // Fetch the students linked to TA's courses
  const { data: studentData, error: studentError } = await supabaseAdmin
    .from("users") // Assuming users is the TA table
    .select(`
      courses (
        course_students (
          students (student_name)
        )
      )
    `)
    .eq("email", email); // Filter by TA email

  // Fetch Professor names
  const { data: professorData, error: professorError } = await supabaseAdmin
    .from("users")
    .select("name")
    .eq("role", "professor");

  if (studentError || professorError) {
    return NextResponse.json({ error: studentError?.message || professorError?.message }, { status: 500 });
  }

  // Step 1: Collect all student names
  const studentNames = [];
  studentData.forEach((user) => {
    user.courses.forEach((course) => {
      course.course_students.forEach((studentObj) => {
        studentNames.push(studentObj.students.student_name);
      });
    });
  });

  // Step 2: Remove duplicates using Set
  const uniqueStudentNames = [...new Set(studentNames)];

  // Step 3: Return both unique student names and professor names
  const combinedResponse = {
    professors: professorData.map(prof => prof.name), // Extract professor names
    students: uniqueStudentNames, // Unique student names
  };

  return NextResponse.json(combinedResponse);
}
