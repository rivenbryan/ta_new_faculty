// types.ts

// Define the Comment interface
export interface Comment {
  user_id: number;
  ticket_id: number;
  comment_id: number;
  comment_text: string;
}


// Define the Ticket interface
export interface Ticket {
  ticketNumber: string;
  ticketDescription: string;
  courseGroupType: string;
  category: string;
  student: string;
  details: string;
  prof: string;
  ta: string;
  priority: "low" | "medium" | "high"; // Add priority field
  comments: Comment[]; // Array of comments
}

export interface TicketResponse {
  ticket_id: number;
  ticket_description: string;
  course_group_type: string;
  category: string;
  priority: string;  // Could be "Low", "Medium", "High", but using string for flexibility
  details: string;
  created_at: string;  // ISO string for the timestamp
  prof_name: string;   // Professor's name
  ta_name: string;     // Teaching Assistant's name
  student_name: string;  // Student's name
  comments: Comment[];  // Array of comments
}

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string | null;
    };
    role: "professor" | "ta" | null;
  }
}