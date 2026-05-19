'use client'

import { useState } from "react"
import { createClient } from "../../utils/supabase/client"
import { useRouter } from "next/navigation"

export default function NewTaskForm(){
    const [title,setTitle] = useState("");
    const [loading,setLoading] = useState(false);

    const supabase  = createClient();
    const router = useRouter();

    const handleSubmit = async (e:React.FormEvent) =>{
        e.preventDefault();
        if(!title.trim()) return;
        setLoading(true);

        const {error} = await supabase.from('tasks').insert([{title:title}]);

        if(error){
            console.error("Error adding task: ",error.message);
        }else{
            setTitle('');
            router.refresh();
        }
        setLoading(false);
    }
    return (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
            <input type="text"
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder = "What needs to be done?"
            className ="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
            <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {loading ? 'Adding...' : 'Add task'}
            </button>
        </form>
    );
}