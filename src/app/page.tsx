'use client'

import { useEffect,useState } from "react";
import { createClient } from "../../utils/supabase/client";


interface Task{
  id : number;
  created_at:string;
  title:string;
  is_completed:boolean;
}
export default function Home(){
  const [tasks,setTasks]=useState<Task[]>([]);
  const supabase = createClient();

  useEffect(()=>{
    const fetchTasks = async ()=>{
      const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at',{ascending:false});

      if(error){
        console.log("error fetching tasks: ",error);
      }else{
        setTasks(data || []);
      }
    };
    fetchTasks();
  },[])

  return(
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Task Manager</h1>
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 border rounded-lg shadow-sm flex items-center justify-between">
            <span className={task.is_completed ? "line-through text-gray-500" : "font-medium"}>
              {task.title}
            </span>
            <input 
              type="checkbox" 
              checked={task.is_completed} 
              readOnly 
              className="w-5 h-5 cursor-pointer" 
            />
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-gray-500 text-center mt-4">No tasks found. Add some in the Supabase dashboard!</p>
        )}
      </div>
    </main>
  );
}