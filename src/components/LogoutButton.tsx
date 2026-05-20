'use client'

import { useTransition } from "react"
import { logoutUser } from "@/actions/authActions"
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton(){
  const [isPending,startTransition] = useTransition();
  const supabase = createClient();

  const handleLogout = async ()=>{
    await supabase.auth.signOut();

    startTransition(()=>{
      logoutUser();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="text-xs font-bold bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-wait"
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}