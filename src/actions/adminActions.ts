'use server'

import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient} from '@/utils/supabase/server'
import { revalidatePath } from "next/cache"



    const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
    
);
export async function deleteUserAccount(userId : string){



    console.log("Checking Master Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "KEY FOUND" : "NOT FOUND");
    const supabase = await createServerClient();

    const {data : {user}} = await supabase.auth.getUser();
    if(!user) return;

    const {data : roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id',user.id)
    .single();

    if(roleData?.role !== "admin"){
        console.error("unauthorized attempt to delete user!");
        return;
    }

    const {error} = await supabaseAdmin.auth.admin.deleteUser(userId);

    if(error){
        console.error("Error deleting user: ",error.message);


    }

    revalidatePath('/admin');
}