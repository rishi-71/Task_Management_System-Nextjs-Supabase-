'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function addTask(formData : FormData){
    const title = formData.get('title') as string;
    const imageFile = formData.get('image') as File | null;

    if(!title) return;

    const supabase = await createClient();

    const {data:{user}} = await supabase.auth.getUser();

    if(!user) return;

    let imageUrl = null;

    if(imageFile && imageFile.size > 0){
        const fileExt = imageFile.name.split('-').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const {data: uploadData, error: uploadError} = await supabase.storage.from('task-images').upload(filePath,imageFile);

        if(uploadError){
            console.error('Error uploadin image:',uploadError.message);
            return;
        }

        const {data: publicUrlData} = supabase.storage.from('task-images').getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
    }

    const {error} = await supabase.from('tasks')
    .insert([{
        title:title,
        image_url: imageUrl
    }]);

    if(error){
        console.error("Error adding task:", error.message);
        return;
    }

    revalidatePath('/');
}