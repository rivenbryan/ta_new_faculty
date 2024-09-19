import { Ticket } from "@/app/utils/types";
import React from "react";
import { CiUser } from "react-icons/ci";
import TicketStatus from "./TicketStatus";
type Props = {};

export default function TicketInformation({
  selectedTicket,
}: {
  selectedTicket: Ticket;
}) {
  const {
    category,
    ticketNumber,
    courseGroupType,
    student,
    details,
    comments,
    priority,
    ta,
  } = selectedTicket;
  return (
    <div className="flex flex-col gap-8 flex-grow">
      <div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex ">
            <p className="font-bold text-xl">{ticketNumber}</p>
         
          </div>
          <hr />
        </div>
        <div className="flex">
          <div className="flex flex-col gap-2 text-xm">
            <p>Course Group Type: {courseGroupType} </p>
            <hr />
            <p>Category: {category}</p>
            <hr />
            <p>Student: {student}</p>
            <hr />
            <p>Details: {details} </p>
            <hr />
          </div>
          <div className="ml-auto mr-4">
          <TicketStatus ta={ta} priority={priority}/>
          </div>
        </div>
      </div>
    
      <p>Comments</p>
      <div className="flex flex-col">
        {comments.map((comment) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <CiUser size={64} />
              <p>{comment.author}</p>
            </div>
            <p className="bg-blue-100 p-6 rounded-xl">{comment.message}</p>
            <p className="text-xs">{comment.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
