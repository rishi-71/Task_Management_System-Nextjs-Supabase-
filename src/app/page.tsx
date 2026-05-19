import LogoutButton from "@/components/LogoutButton";
import { createClient } from "../utils/supabase/server";
//import { redirect } from "next/navigation";
import NewTaskForm from "@/components/NewTaskForm";

export default async function Home(){

  const supabase = await createClient();

  const {data : {user}} = await supabase.auth.getUser();

  // if(!user){
  //   redirect('/login');
  // }

  const {data: tasks, error} = await supabase.from('tasks')
  .select("*")
  .order('created_at',{ascending: false});

  if(error){
    console.log("error fetching tasks: ",error.message);
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Task Manager</h1>
        {/* Display the logged-in user's email */}
       <div className="flex items-center">
          <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
            {user?.email}
          </span>
          <LogoutButton />
        </div>
      </div>

      <NewTaskForm/>
      
      <div className="space-y-4">
        {/* We map over the tasks just like before, but no need for state! */}
        {tasks?.map((task) => (
          <div key={task.id} className="p-4 border rounded-lg shadow-sm flex items-center justify-between">
            <span className={task.is_completed ? "line-through text-gray-500" : "font-medium"}>
              {task.title}
            </span>
            <input 
              type="checkbox" 
              defaultChecked={task.is_completed} 
              className="w-5 h-5 cursor-pointer" 
            />
          </div>
        ))}

        {(!tasks || tasks.length === 0) && (
          <p className="text-gray-500 text-center mt-4">No tasks found. Time to add some!</p>
        )}
      </div>
    </main>
  );
}