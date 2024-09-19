import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useSession } from "next-auth/react";

// Sample categories for the dropdown
const categories = ["Technical Issue", "Student Request", "Project", "Grading", "General Inquiry"];
const priorities = ["Low", "Medium", "High"];

export default function TicketForm({setIsFormOpen, isFormOpen, refreshData, students, professors }: any) {
  // State to store students and professors
  const { data: session } = useSession(); // Hook to access session
  const [isSubmitting, setIsSubmitting] = useState(false); // For handling submission state

  // Fetch students and professors when component mounts
 

  // Form schema using zod
  const formSchema = z.object({
    ticket_name: z.string().min(1, { message: "Ticket Name is required" }),
    course_group_type: z.string().min(1, { message: "Course group type is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    priority: z.string().min(1, { message: "Priority is required" }),
    details: z.string().min(5, { message: "Details must be at least 5 characters" }),
    student_name: z.string().min(1, { message: "Student name is required" }),
    prof_name: z.string().min(1, { message: "Professor name is required" }),
  });
  const handleClick = () => {
    setIsFormOpen(true);
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticket_name: "",
      course_group_type: "",
      category: "",
      priority: "",
      details: "",
      student_name: "",
      prof_name: "",
    },
  });
  const router = useRouter(); // Initialize useRouter hook
  // Fields configuration for text inputs
  const fields = [
    { name: "ticket_name", label: "Ticket Name", placeholder: "Enter ticket name" },
    { name: "course_group_type", label: "Course Group Type", placeholder: "Enter course group type" },
  ];

  // Dropdown configuration for select inputs
  const dropdowns = [
    { name: "category", label: "Category", options: categories },
    { name: "priority", label: "Priority", options: priorities },
  ];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/tickets", values);
      if (response.status === 200) {
        alert("Ticket created successfully!");
        form.reset();
        setIsFormOpen(false); // Close form after submission
        refreshData();  // Re-fetch the students and professors list
      } else {
        console.error("Failed to create ticket:", response.data);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  return (
    <div className="ml-auto">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button onClick={handleClick}> + </Button>
        </AlertDialogTrigger>
        {isFormOpen &&
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              <Form {...form}>
                <form className="space-y-8">
                  {/* Map through fields configuration to render text inputs */}
                  <div className="grid grid-cols-2 gap-6">
                    {fields.map((field) => (
                      <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        render={({ field: inputField }) => (
                          <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <Input placeholder={field.placeholder} {...inputField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Professor Name Dropdown */}
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="prof_name"
                      render={({ field: selectField }) => (
                        <FormItem>
                          <FormLabel>Professor Name</FormLabel>
                          <FormControl>
                            <select
                              {...selectField}
                              className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Select Professor</option>
                              {professors.map((professor, idx) => (
                                <option key={idx} value={professor}>
                                  {professor}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Student Name Dropdown */}
                    <FormField
                      control={form.control}
                      name="student_name"
                      render={({ field: selectField }) => (
                        <FormItem>
                          <FormLabel>Student Name</FormLabel>
                          <FormControl>
                            <select
                              {...selectField}
                              className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Select Student</option>
                              {students.map((student, idx) => (
                                <option key={idx} value={student}>
                                  {student}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Map through dropdowns configuration to render select inputs */}
                  <div className="grid grid-cols-2 gap-6">
                    {dropdowns.map((dropdown) => (
                      <FormField
                        key={dropdown.name}
                        control={form.control}
                        name={dropdown.name}
                        render={({ field: selectField }) => (
                          <FormItem>
                            <FormLabel>{dropdown.label}</FormLabel>
                            <FormControl>
                              <select
                                {...selectField}
                                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              >
                                <option value="">Select {dropdown.label.toLowerCase()}</option>
                                {dropdown.options.map((option, idx) => (
                                  <option key={idx} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Details field as Textarea */}
                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter details" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                 


                </form>
              </Form>
            </AlertDialogDescription>
          </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Submit</AlertDialogAction>
          <AlertDialogAction onClick={() => setIsFormOpen(false)}>Cancel</AlertDialogAction>
 
        </AlertDialogFooter>
        </AlertDialogContent>
         }
      </AlertDialog>
    </div>
  );
}
