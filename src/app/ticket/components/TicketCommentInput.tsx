import React from 'react'
import { CiUser } from "react-icons/ci";
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';

type Props = {}

export default function TicketCommentInput({}: Props) {
  return (
    <div className='flex flex-col gap-4 m-4'>

        <hr/>
        <div className='flex gap-4 items-center '>
        <CiUser className="pt-2" size={40}/>
        <Textarea placeholder="Type your message here." id="message-2" />
        <Button>Submit</Button>
        </div>
    </div>
  )
}