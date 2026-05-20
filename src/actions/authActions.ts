'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function logoutUser(){
    const supabase =  await createClient();
    //now this does two things:
    // tells supabase to destroy the session on their servers.
    //  tells the nextjs server to delete the auth cookies from the user's browser

    const {error} = await supabase.auth.signOut();

    if(error){
        console.error("Error during logout: ",error.message);
    }

    redirect('/login');
}