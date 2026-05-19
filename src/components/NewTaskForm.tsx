'use client'; 

import { useRef, useState } from 'react';
import { addTask } from '@/actions/taskActions'; 

export default function NewTaskForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form 
      action={async (formData) => {
        setIsUploading(true);
        await addTask(formData); 
        formRef.current?.reset(); 
        setIsUploading(false);
      }} 
      ref={formRef}
      className="mb-10 bg-zinc-900/80 border border-zinc-800 p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 shadow-2xl shadow-black/50 backdrop-blur-md"
    >
      <input
        type="text"
        name="title" 
        placeholder="What needs to be done?"
        className="w-full flex-1 bg-transparent p-4 text-zinc-100 placeholder-zinc-500 focus:outline-none text-lg"
        required
      />
      
      <div className="flex w-full md:w-auto justify-between md:justify-end items-center border-t border-zinc-800 md:border-t-0 pt-2 md:pt-0 pl-2">
        <input 
          type="file" 
          name="image" 
          accept="image/*"
          className="text-sm text-zinc-500 file:cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 hover:file:text-white transition-all w-[200px]"
        />

        <button
          type="submit"
          disabled={isUploading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap"
        >
          {isUploading ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}