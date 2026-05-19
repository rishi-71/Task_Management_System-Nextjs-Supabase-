import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

//this function creates a supabase client that runs only on the next.js server
export async function createClient(){
    //we use next.js build-in cookies() function to get the user's browser cookies
    const cookieStore =  await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                //we tell supabase how to read the cookies from the nextjs server
                get(name : string){
                    return  cookieStore.get(name)?.value;
                }
            }
        }
    )
}