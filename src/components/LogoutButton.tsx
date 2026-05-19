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
  // Inside LogoutButton.tsx, replace the button class with:
<button
  onClick={handleLogout}
  className="text-xs font-bold bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all"
>
  Logout
</button>
  );
}



