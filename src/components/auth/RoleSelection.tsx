"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import Axios
import { PROFESSOR, TA } from "@/app/utils/constant";

const formSchema = z.object({
  role: z.enum([PROFESSOR, TA], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});

export default function RoleSelection() {
  const router = useRouter(); // For redirecting after form submission
  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/roles", {
        role: values.role,
      });

      if (response.status === 200) {
        // Redirect to the dashboard or another page after successful role selection
        router.push("/");
      } else {
        console.error("Failed to set role:", response.data);
      }
    } catch (error) {
      console.error("Error submitting role:", error);
    }
  }
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: PROFESSOR,
    },
  });

  // 2. Define a submit handler.

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please select your role:</FormLabel>
              <FormControl>
                <select
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...field}
                >
                  <option value="Professor">Professor</option>
                  <option value="Teaching Assistant">Teaching Assistant</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
