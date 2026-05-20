import { createClient } from '@/utils/supabase/server'; 
import { redirect } from 'next/navigation';
import NewTaskForm from '@/components/NewTaskForm'; 
import LogoutButton from '@/components/LogoutButton'; 
import Link from 'next/link'; 
import TaskItem from '@/components/TaskItem';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  //fetching the user's role
  const {data:roleData} = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id',user.id)
  .single() // because user has only one role

  const userRole = roleData?.role || 'user';

  const resolvedParams = await searchParams;
  const currentFilter = typeof resolvedParams.filter === 'string' ? resolvedParams.filter : 'all';
  const currentPage = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  
  const tasksPerPage = 3; 
  const from = (currentPage - 1) * tasksPerPage;
  const to = from + tasksPerPage - 1;

  let query = supabase
    .from('tasks')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (currentFilter === 'completed') query = query.eq('is_completed', true);
  else if (currentFilter === 'active') query = query.eq('is_completed', false);

  const { data: tasks, count, error } = await query;
  if (error) console.error("Error fetching tasks:", error.message);

  const totalTasks = count || 0;
  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  return (
    // 1. Sleek global dark background
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30 font-sans pb-20">
      <main className="max-w-3xl mx-auto p-6 md:p-12">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Task Master
          </h1>
          <div className="flex items-center gap-3 bg-zinc-900/80 p-1.5 pr-2 rounded-full border border-zinc-800 backdrop-blur-md">
            
            <div className="flex items-center gap-3 bg-zinc-900/80 p-1.5 pr-2 rounded-full border border-zinc-800 backdrop-blur-md">
            
            {userRole === 'admin' && (
              <Link href="/admin" className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 ml-1 transition-all cursor-pointer">
                ADMIN PANEL ⚙️
              </Link>
            )}

            <span className="text-xs font-medium text-zinc-400 pl-3 border-l border-zinc-700">
              {user?.email}
            </span>
            <LogoutButton />
          </div>


          </div>
        </div>
        
        {/* ADD TASK FORM */}
        <NewTaskForm />

        {/* MODERN PILL FILTERS */}
        <div className="flex gap-2 mb-8 bg-zinc-900/50 p-1.5 rounded-2xl w-fit border border-zinc-800">
          <Link 
            href={`/?filter=all&page=1`}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${currentFilter === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
          >
            All
          </Link>
          <Link 
            href={`/?filter=active&page=1`}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${currentFilter === 'active' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
          >
            Active
          </Link>
          <Link 
            href={`/?filter=completed&page=1`}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${currentFilter === 'completed' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
          >
            Completed
          </Link>
        </div>
        
        {/* TASK LIST */}
        <div className="space-y-3 mb-10">
          {tasks?.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}

          {(!tasks || tasks.length === 0) && (
            <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-500">
              <p className="text-lg">No tasks found. Time to chill! ☕</p>
            </div>
          )}
        </div>

        {/* DARK THEME PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center bg-zinc-900/50 border border-zinc-800 p-2 rounded-2xl backdrop-blur-sm">
            <Link 
              href={`/?filter=${currentFilter}&page=${currentPage - 1}`}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${currentPage <= 1 ? 'pointer-events-none opacity-40 text-zinc-500' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'}`}
            >
              ← Prev
            </Link>
            <span className="text-sm font-medium text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>
            <Link 
              href={`/?filter=${currentFilter}&page=${currentPage + 1}`}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${currentPage >= totalPages ? 'pointer-events-none opacity-40 text-zinc-500' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'}`}
            >
              Next →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}