import { useState } from "react";
export default function Auth() {
    const [mode, setMode] = useState<'login' | 'signup'>('login')
  return (
    <div className="w-full h-screen p-[20px] lg:p-[40px] flex justify-center items-center">
      <div className="w-full md:w-[40%] min-h-0 bg-[#171717] rounded-[16px] p-[20px] lg:p-[25px]">
        {mode === 'login' ? 
        <div className="w-full h-full flex flex-col items-center">
            <h3 className="text-[28px] lg:text-[20px] font-bold">Wellcome back!</h3>
            <p 
            className="opacity-[0.5] cursor-pointer text-[12px] mt-4"
            onClick={()=>setMode('signup')}
            >
                Don't have an account yet?
            </p>
        </div> :
        <div className="w-full h-full flex flex-col items-center">
            <h3 className="text-[28px] lg:text-[20px] font-bold">First time with Stashify?</h3>
            <p 
            className="opacity-[0.5] cursor-pointer text-[12px] mt-4"
            onClick={()=>setMode('login')}
            >
                Already have an account?
            </p>
        </div>
        }
      </div>
    </div>
  );
}
