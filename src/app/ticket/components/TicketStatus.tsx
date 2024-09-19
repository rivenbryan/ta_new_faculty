import React from "react";
import { FaRegCheckSquare } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
type Props = {
  ta: string;
  priority: string;
};

export default function TicketStatus({ta, priority}: Props) {
  return (
    <div className="flex flex-col gap-8 mr-4">

      <div className="flex items-center gap-4 mt-4">
        <FaUserAlt size={48} />
        <div className="flex flex-col">
          <p className="text-xm">{ta}</p>
          <p className="text-sm">Assignee</p>
        </div>
      </div>
      <div className="flex gap-2 flex-col">
        <p>Priority: {priority}</p>
        <hr />
        <p>Date Created: 2024-03-20</p>
        <hr />
      </div>
    </div>
  );
}
