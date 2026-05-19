'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTask(formData : FormData){

    const title = formData.get('title') as string;

    if(!title){
        return
    }

    const supabase = await createClient();

    const {error} = await supabase.from('tasks').insert([{title:title}]);

    if(error){
        console.log("error adding task via server actions", error.message);
        return;
    }

    revalidatePath('/');
}