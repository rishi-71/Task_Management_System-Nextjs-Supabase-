import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteUserAccount } from "@/actions/adminActions";


export const dynamic = 'force-dynamic';

export default async function AdminDashboard(){
    const supabase = await createServerClient();
    const {data : {user : currentUser}} = await supabase.auth.getUser();

    if(!currentUser) redirect('/login');

    const {data : roleData , error : roleError} = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id',currentUser.id)
    .single();

if (roleData?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-12">
        <h1 className="text-3xl text-red-500 font-bold mb-4">DEBUG MODE: Access Denied</h1>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 font-mono text-sm space-y-4">
          <p><span className="text-zinc-500">Current User ID:</span> {currentUser.id}</p>
          <p><span className="text-zinc-500">Role Data Received:</span> {JSON.stringify(roleData)}</p>
          <p><span className="text-zinc-500">Database Error:</span> {JSON.stringify(roleError)}</p>
        </div>
      </div>
    );
  }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {data : {users}, error} = await supabaseAdmin.auth.admin.listUsers();

    if(error) console.error("Error fetching users: ",error.message);

    return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            Admin Dashboard
          </h1>
          <Link href="/" className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm font-medium transition-all">
            ← Back to Tasks
          </Link>
        </div>

        {/* User List */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900 font-bold text-zinc-400 grid grid-cols-12">
            <div className="col-span-5">Email</div>
            <div className="col-span-4">Joined</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-zinc-800">
            {users?.map((u) => (
              <div key={u.id} className="p-4 flex items-center grid grid-cols-12 hover:bg-zinc-800/30 transition-colors">
                <div className="col-span-5 flex items-center gap-2">
                  <span className="font-medium text-zinc-200">{u.email}</span>
                  {u.id === currentUser.id && (
                     <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">You</span>
                  )}
                </div>
                
                <div className="col-span-4 text-zinc-500 text-sm">
                  {new Date(u.created_at).toLocaleDateString()}
                </div>
                
                <div className="col-span-3 flex justify-end gap-2">
                  {/* We will add the 'View Tasks' button here in the next step! */}
                  <form action={async () => {
                    'use server';
                    await deleteUserAccount(u.id);
                  }}>
                    <button 
                      disabled={u.id === currentUser.id} 
                      className="text-xs font-bold bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}