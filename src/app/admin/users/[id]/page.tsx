import { createClient as createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import TaskItem from "@/components/TaskItem";

export default async function AdminUsersTasks({
    params,
}:{
    params  : Promise<{id : string}>
}){
    const resolvedParams = await params;
    const targetUserId = resolvedParams.id;

    const supabase =  await createServerClient();
    const {data: {user}} = await supabase.auth.getUser();

    if(!user) redirect('/login');

    const {data: roleData} = await supabase.from('user_roles').select('role')
    .eq('user_id',user.id).single();
    if(roleData?.role !== 'admin') redirect('/');

    const {data : userTasks, error} = await supabase
    .from('tasks')
    .select("*")
    .eq('user_id',targetUserId)
    .order('created_at',{ ascending : false});

    if(error) console.error("error fetching user's tasks: ",error.message);

    return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm mb-2 inline-block">
              ← Back to Users
            </Link>
            <h1 className="text-3xl font-extrabold text-white">
              Managing User Tasks
            </h1>
            <p className="text-zinc-400 text-sm mt-1">User ID: <span className="font-mono">{targetUserId}</span></p>
          </div>
        </div>

        <div className="space-y-3">
          {userTasks?.map((task) => (
            // We can reuse our awesome TaskItem component here!
            // Clicking check/delete will trigger our existing Server Actions, 
            // and because we are an Admin, RLS will allow the update/delete to succeed!
            <TaskItem key={task.id} task={task} />
          ))}

          {(!userTasks || userTasks.length === 0) && (
            <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-500">
              <p className="text-lg">This user has no tasks yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}