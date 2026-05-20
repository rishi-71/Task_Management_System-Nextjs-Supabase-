'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function AuthListener(){
    const router = useRouter();
    const supabase = createClient();

    useEffect(()=>{
        const {data:{subscription}} = supabase.auth.onAuthStateChange((event) => {
            if(event === 'SIGNED_OUT'){
                router.push('/login');
                router.refresh();
            }
        });

        return ()=>{
            subscription.unsubscribe();
        };
    },[router,supabase]);

    return null;
}