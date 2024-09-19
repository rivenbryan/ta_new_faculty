"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";
import { TicketScrollArea } from "./components/TicketScrollArea";
import TicketSearchField from "./components/TicketSearchField";
import TicketInformation from "./components/TicketInformation";
import TicketStatus from "./components/TicketStatus";
import TicketCommentInput from "./components/TicketCommentInput";
import { Ticket, TicketResponse } from "../utils/types";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AUTH, UNAUTH } from "../utils/constant";
import axios from "axios";
import TicketForm from "./components/TicketForm";

type Props = {};

export default function Page({}: Props) {
  const fetchTicketData = async () => {
    try {
      const response = await axios.get("/api/tickets");
      const data: TicketResponse[] = response.data;
      if (response.status === 200) {
        // Map the data to fit the Ticket interface structure
        const tickets: Ticket[] = data.map((ticket) => ({
          ticketDescription: ticket.ticket_description,
          ticketNumber: `TIC-${ticket.ticket_id}`,
          courseGroupType: ticket.course_group_type,
          category: ticket.category,
          prof: ticket.prof_name,
          student: ticket.student_name,
          ta: ticket.ta_name,
          details: ticket.details,
          priority: ticket.priority.toLowerCase() as "low" | "medium" | "high",
          comments: ticket.comments.map((comment: any) => ({
            user_id: comment.user_id,
            ticket_id: comment.ticket_id,
            comment_id: comment.comment_id,
            comment_text: comment.comment_text,
          })),
        }));

        // Update state with the formatted tickets
        setTickets(tickets);
        setSelectedTicket(tickets[0]);
      } else {
        console.error("Failed to fetch tickets:", response.data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchData = async () => {
    // Fetch updated dropdown data for students and professors
    try {
      const response = await axios.get('http://localhost:3000/api/addtickets?email=' + session?.user?.email);
      setStudents(response.data.students); // Update students state
      setProfessors(response.data.professors); // Update professors state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const { data: session, status } = useSession(); // Hook to access session
  const authenticated = session && status === AUTH;
  const router = useRouter();
  console.log(status);
  useEffect(() => {
    if (status === UNAUTH) {
      router.push("/error");
    }

    if (status === AUTH) {
      fetchTicketData();
      fetchData(); // Fetch dropdown data initially
    }
  }, [status]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket>();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [students, setStudents] = useState<string[]>([]); // Students array
  const [professors, setProfessors] = useState<string[]>([]); // Professors array
  console.log(tickets);

  return (
    authenticated &&
    tickets &&
    selectedTicket && (
      <>
        <div>
          <Navbar />

          <div className="flex gap-8 min-h-screen">
            <div
              className="w-1/4 flex flex-col bg-gray-100"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <div className="flex  m-2 mt-4 ">
                <p className="font-bold text-xl ">Tickets</p>
                 <TicketForm 
                    setIsFormOpen={setIsFormOpen} 
                    isFormOpen={isFormOpen} 
                    refreshData={fetchData}  // Pass the refresh function to the form
                    students={students} // Pass students to the form
                    professors={professors} // Pass professors to the form
                 />
              </div>
              <TicketSearchField />
              <div className="flex-grow overflow-y-auto h-56">
                <TicketScrollArea
                  tickets={tickets}
                  setSelectedTicket={setSelectedTicket}
                  selectedTicket={selectedTicket}
                />
              </div>
            </div>

            <div className="w-3/4 flex flex-col gap-8 mt-4">
              <TicketInformation selectedTicket={selectedTicket} />
              <TicketCommentInput />
            </div>
          </div>
        </div>
      </>
    )
  );
}
