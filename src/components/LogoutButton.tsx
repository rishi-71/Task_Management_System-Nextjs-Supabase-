'use client'
import { createClient } from "../utils/supabase/client"
import { useRouter } from "next/navigation";

export default function LogoutButton(){
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async  ()=>{
        const {error} = await supabase.auth.signOut();

        if(error){
            console.error("Error Logging Out: ",error.message);
        }
        else{
            router.push('/login');
            router.refresh();
        }
    }
    return (
    <button
      onClick={handleLogout}
      className="ml-4 text-sm bg-red-100 text-red-600 px-4 py-1 rounded-full hover:bg-red-200 transition-colors"
    >
      Log Out
    </button>
  );
}



