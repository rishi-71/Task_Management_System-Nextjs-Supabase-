'use client';

import { useTransition } from 'react';
import { toggleTask, deleteTask } from '@/actions/taskActions';

interface Task {
  id: number;
  title: string;
  is_completed: boolean;
  image_url: string | null;
}

export default function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`group flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl hover:border-zinc-700 hover:bg-zinc-800/40 transition-all duration-300 ${isPending ? 'opacity-50 scale-[0.98]' : ''}`}>
      
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => startTransition(() => toggleTask(task.id, task.is_completed))}>
        {/* Custom larger checkbox look */}
        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${task.is_completed ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600 group-hover:border-blue-400'}`}>
           {task.is_completed && <span className="text-white text-sm font-bold">✓</span>}
        </div>
        
        {task.image_url && (
          <img 
            src={task.image_url} 
            alt="Task attachment" 
            className="w-12 h-12 object-cover rounded-xl border border-zinc-700"
          />
        )}

        <span className={`text-lg transition-all duration-300 ${task.is_completed ? 'text-zinc-600 line-through decoration-zinc-600' : 'text-zinc-200 group-hover:text-white'}`}>
          {task.title}
        </span>
      </div>

      <button 
        onClick={() => startTransition(() => deleteTask(task.id))}
        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-zinc-500 hover:text-red-400 bg-zinc-800/50 hover:bg-red-500/10 px-4 py-2 rounded-xl text-sm font-bold transition-all"
      >
        Delete
      </button>
    </div>
  );
}