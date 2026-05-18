'use client';

import { useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function  LoginPage(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState<string | null>(null);
    const [loading,setLoading] = useState(false);

    //initialize supabase client and nextjs router
    const supabase = createClient();
    const router = useRouter();

    //function to handle signing up a new user
    const handleSignUp = async(e:React.FormEvent)=>{
        e.preventDefault();//prevents the page from refreshing when the form is submitted
        setLoading(true);
        setError(null);

        //supabase.auth.signUp sends the email/password to the GoTrue server
        const {data,error} = await supabase.auth.signUp({
            email,
            password,
        });

        if(error){
            setError(error.message);
        }else{
            router.push("/");
        }
        setLoading(false);
    };

    //function to handle logging in an existing user
    const handleLogin = async (e:React.FormEvent) =>{
        e.preventDefault();
        setLoading(true);
        setError(null);

        //signInWithPassword checks the credentials and issues the jwt session cookie
        const { data, error}= await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if(error){
            setError(error.message);
        }else{
            router.push('/');
        }
        setLoading(false);

    };

    return (
    <main className="max-w-md mx-auto p-8 mt-20 border rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Task Manager</h1>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Display error messages dynamically if they exist */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Log In'}
          </button>
          
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>
      </form>
    </main>
  );
}