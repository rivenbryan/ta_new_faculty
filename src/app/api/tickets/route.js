import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabaseAdmin } from "@/app/utils/supabaseClient";
import { authOptions } from "../auth/[...nextauth]/route";


export async function GET(req) {
  // Get the session from NextAuth.js
  const session = await getServerSession(authOptions);

  if (!session) {
    // If no session is found, return a 401 Unauthorized response
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the email from the session
  const email = session.user?.email;

  if (!email) {
    return NextResponse.json(
      { error: "User email not found in session" },
      { status: 400 }
    );
  }

  // Fetch the user ID from the Users table based on the email
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  if (!user || !user.id) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = user.id;

  // Step 1: Fetch the tickets including prof_id, ta_id, and student_id
  const { data: tickets, error: ticketError } = await supabaseAdmin
    .from("tickets")
    .select(`
      ticket_id,
      ticket_description,
      course_group_type,
      category,
      priority,
      details,
      created_at,
      prof_id,
      ta_id,
      student_id,
      comments (
        comment_id,
        ticket_id,
        comment_text,
        user_id
      )
    `)
    .or(`prof_id.eq.${userId},ta_id.eq.${userId},student_id.eq.${userId}`);

  if (ticketError) {
    return NextResponse.json({ error: ticketError.message }, { status: 500 });
  }

  // Step 2: Collect all unique user IDs (prof_id, ta_id) and student IDs from the tickets, plus comment user IDs
  const userIds = [
    ...new Set(tickets.flatMap(ticket => [ticket.prof_id, ticket.ta_id])),
  ];
  const studentIds = [...new Set(tickets.map(ticket => ticket.student_id))];
  const commentUserIds = [
    ...new Set(tickets.flatMap(ticket => ticket.comments.map(comment => comment.user_id))),
  ];

  // Combine all unique user IDs (professor, TA, and commenters)
  const allUserIds = [...new Set([...userIds, ...commentUserIds])];

  // Step 3: Fetch the names of all related users (professor, TA, and commenters)
  const { data: users, error: userFetchError } = await supabaseAdmin
    .from("users")
    .select("id, name")
    .in("id", allUserIds);

  if (userFetchError) {
    return NextResponse.json({ error: userFetchError.message }, { status: 500 });
  }

  // Step 4: Fetch the names of all related students
  const { data: students, error: studentFetchError } = await supabaseAdmin
    .from("students")
    .select("student_id, student_name")
    .in("student_id", studentIds);

  if (studentFetchError) {
    return NextResponse.json({ error: studentFetchError.message }, { status: 500 });
  }

  // Create a mapping of user IDs to user names
  const userMap = users.reduce((map, user) => {
    map[user.id] = user.name;
    return map;
  }, {});

  // Create a mapping of student IDs to student names
  const studentMap = students.reduce((map, student) => {
    map[student.student_id] = student.student_name;
    return map;
  }, {});

  // Step 5: Map the names back to the ticket data and drop prof_id, ta_id, and student_id
  const ticketsWithNames = tickets.map(({ prof_id, ta_id, student_id, comments, ...ticket }) => ({
    prof_name: userMap[prof_id],
    ta_name: userMap[ta_id],
    student_name: studentMap[student_id],
    comments: comments.map(({ user_id, ...comment }) => ({
      user_name: userMap[user_id], // Map user ID to user name for each comment
      ...comment, // Spread the rest of the comment data, excluding user_id
    })),
    ...ticket,
  }));

  // Return the tickets with their associated comments and mapped names as a JSON response
  return NextResponse.json(ticketsWithNames);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const email = session.user.email;

  try {
    const body = await req.json(); // Parse the incoming JSON request body
    const { category, course_group_type, details, priority, prof_name, student_name, ticket_name } = body;

    // Fetch the professor ID based on prof_name
    const { data: professorData, error: professorError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("name", prof_name)
      .eq("role", "professor")
      .single();

    if (professorError || !professorData) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 });
    }

    const prof_id = professorData.id;

    // Fetch the student ID based on student_name
    const { data: studentData, error: studentError } = await supabaseAdmin
      .from("students")
      .select("student_id")
      .eq("student_name", student_name)
      .single();

    if (studentError || !studentData) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const student_id = studentData.student_id;

    // Fetch the TA ID based on the session email
    const { data: taData, error: taError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (taError || !taData) {
      return NextResponse.json({ error: "TA not found" }, { status: 404 });
    }

    const ta_id = taData.id;

    // Insert the new ticket into the "tickets" table
    const { error: insertError } = await supabaseAdmin
      .from("tickets")
      .insert({
        ticket_description: ticket_name,
        course_group_type,
        category,
        priority,
        details,
        prof_id,
        student_id,
        ta_id,
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Return a successful response
    return NextResponse.json({
      message: "Ticket submitted successfully!",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
