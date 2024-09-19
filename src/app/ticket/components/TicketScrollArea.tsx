"use client";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiBookmark } from "react-icons/fi";
import { Ticket } from "@/app/utils/types";

export function TicketScrollArea({
  tickets,
  setSelectedTicket,
  selectedTicket,
}: {
  tickets: Ticket[];
  setSelectedTicket: React.Dispatch<React.SetStateAction<Ticket | undefined>>; // Allow undefined here
  selectedTicket: Ticket; // Allow undefined for selectedTicket
}) {

  return (
    <ScrollArea>
      <div>
        {tickets.map((ticket) => (
          <div
            key={ticket.ticketNumber}
            className={`flex gap-2 items-center p-4 rounded-md cursor-pointer ${
              selectedTicket.ticketNumber === ticket.ticketNumber ? "bg-blue-100" : "bg-gray-100"
              }`}
            onClick={() => setSelectedTicket(ticket)}
          >
            <FiBookmark size={40} />
            <div className="flex flex-col">
              <p className="text-xm">{ticket.ticketNumber}</p>
              <p className="text-xm">{ticket.ticketDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
