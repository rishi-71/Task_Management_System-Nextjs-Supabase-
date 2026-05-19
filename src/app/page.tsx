import { createClient } from '@/utils/supabase/server'; 
import { redirect } from 'next/navigation';
import NewTaskForm from '@/components/NewTaskForm'; 
import LogoutButton from '@/components/LogoutButton'; 
import Link from 'next/link'; // We use Next.js Links to change the URL without refreshing

// 1. Next.js passes searchParams to our Server Component
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Await and extract the searchParams (Next.js 15 requirement)
  const resolvedParams = await searchParams;
  
  // 3. Set up our Filter and Page logic
  const currentFilter = typeof resolvedParams.filter === 'string' ? resolvedParams.filter : 'all';
  const currentPage = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  
  // 4. Calculate our Pagination Range
  const tasksPerPage = 3; 
  const from = (currentPage - 1) * tasksPerPage;
  const to = from + tasksPerPage - 1;

  // 5. Build the Supabase Query dynamically
  let query = supabase
    .from('tasks')
    .select('*', { count: 'exact' }) // 'exact' tells Supabase to also return the total number of tasks!
    .order('created_at', { ascending: false })
    .range(from, to);

  // Apply the filter if it's not 'all'
  if (currentFilter === 'completed') {
    query = query.eq('is_completed', true);
  } else if (currentFilter === 'active') {
    query = query.eq('is_completed', false);
  }

  // Execute the query
  const { data: tasks, count, error } = await query;

  if (error) {
    console.error("Error fetching tasks:", error.message);
  }

  // Calculate total pages for our Next/Prev buttons
  const totalTasks = count || 0;
  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Task Manager</h1>
        <div className="flex items-center">
          <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">{user?.email}</span>
          <LogoutButton />
        </div>
      </div>
      
      <NewTaskForm />

      {/* FILTERING UI */}
      <div className="flex gap-4 mb-4 border-b pb-4">
        <Link 
          href={`/?filter=all&page=1`}
          className={currentFilter === 'all' ? 'font-bold text-blue-600' : 'text-gray-500'}
        >
          All
        </Link>
        <Link 
          href={`/?filter=active&page=1`}
          className={currentFilter === 'active' ? 'font-bold text-blue-600' : 'text-gray-500'}
        >
          Active
        </Link>
        <Link 
          href={`/?filter=completed&page=1`}
          className={currentFilter === 'completed' ? 'font-bold text-blue-600' : 'text-gray-500'}
        >
          Completed
        </Link>
      </div>
      
      {/* TASK LIST */}
      <div className="space-y-4 mb-6">
        {tasks?.map((task) => (
          <div key={task.id} className="p-4 border rounded-lg shadow-sm flex items-center justify-between">
            <span className={task.is_completed ? "line-through text-gray-500" : "font-medium"}>
              {task.title}
            </span>
            <input 
              type="checkbox" 
              defaultChecked={task.is_completed} 
              className="w-5 h-5 cursor-pointer" 
              // Note: We haven't built the update functionality yet!
            />
          </div>
        ))}

        {(!tasks || tasks.length === 0) && (
          <p className="text-gray-500 text-center mt-4">No tasks found for this filter.</p>
        )}
      </div>

      {/* PAGINATION UI */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
          <Link 
            href={`/?filter=${currentFilter}&page=${currentPage - 1}`}
            className={`px-4 py-2 bg-white border rounded shadow-sm ${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
          >
            Previous
          </Link>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Link 
            href={`/?filter=${currentFilter}&page=${currentPage + 1}`}
            className={`px-4 py-2 bg-white border rounded shadow-sm ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
          >
            Next
          </Link>
        </div>
      )}
    </main>
  );
}              