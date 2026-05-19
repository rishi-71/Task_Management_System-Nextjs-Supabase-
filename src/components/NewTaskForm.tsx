'use client'


import { useRef } from "react";
import { addTask } from "@/actions/taskActions";

export default function NewTaskForm(){
  const formRef = useRef<HTMLFormElement>(null);
    
    return (
        <>
     {/* Instead of an onSubmit handler, we pass our Server Action to the 'action' attribute */}
    <form 
      action={async (formData) => {
        await addTask(formData); // Call the server action
        formRef.current?.reset(); // Clear the input field after it finishes
      }} 
      ref={formRef}
      className="mb-6 flex gap-2"
    >
      <input
        type="text"
        name="title" // 🔥 IMPORTANT: The name attribute must match what we look for in the Server Action (formData.get('title'))
        placeholder="What needs to be done?"
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Task
      </button>
    </form>
    </>
    );
}