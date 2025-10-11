// Component for verifying user account with OTP
'use client'
import { Loader, MailCheck } from 'lucide-react'
import React, {useState,useEffect ,useRef ,ChangeEvent ,KeyboardEvent} from 'react'
import LoadingButton from '../Helper/LoadingButton'
import axios from 'axios'
import { BASE_API_URL } from '@/server'
import { handleAuthRequest } from '../utils/apiRequest'
import { useDispatch ,useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { setAuthUser } from '@/store/authSlice'
import { toast } from 'sonner'
import { RootState } from '@/store/store'

const Verify = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading , setIsLoading] = useState(false);
   const user = useSelector((state:RootState) =>state?.auth.user);
  const [otp , setOtp] = useState<string[]>(['','','','','','']);
  const [isPageLoadin, setIsPageLoading] = useState(true);

  useEffect(() => {
    if(!user){
      router.replace('/auth/login');
    }else if(user && user.isVerified){
      router.replace('/');
    }else{
      setIsPageLoading(false);
    }

  },[user,router]);


  const inputRefs = useRef<(HTMLInputElement|null)[]>([]);
  
  const handleChange = (event:ChangeEvent<HTMLInputElement>, index:number):void => {
    const { value } = event.target;
    if(/^[0-9]$/.test(value) && value.length <=1){
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  }
  if(value.length === 1 && inputRefs.current[index+1]){
    inputRefs.current[index+1]?.focus();
  }
};
const handleKeyDown = (
  event:KeyboardEvent<HTMLInputElement>,
   index:number):void => {  
  if(
      event.key === 'Backspace'
      && !inputRefs.current[index]?.value
      && inputRefs.current[index-1]
   ){
       inputRefs.current[index-1]?.focus();
    }
};

const handleSubmit = async ()=>{
  const otpValue = otp.join("");
  const verifyReq = async()=>
     await axios.post(`${BASE_API_URL}/auth/verify`,
      {otp:otpValue},{withCredentials:true});
 const result = await handleAuthRequest(verifyReq ,setIsLoading);
 
      if(result){
         dispatch(setAuthUser(result.data.data.user));
         toast.success(result.data.message);
         router.push('/');
      }
};

const handleResendOtp = async() =>{
  const resendOtpReq = async()=>
    await axios.post(`${BASE_API_URL}/auth/resend-otp`,
      null, {withCredentials:true});
  const result = await handleAuthRequest(resendOtpReq,setIsLoading);
    if(result){
       toast.success(result.data.message);
    }    
};
    if(isPageLoadin){
      return(
        <div className='h-screen flex  items-center justify-center'>
          <Loader className='w-20 h-20 animate-spin' />
        </div>
      )
    }

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <MailCheck className='w-20 h-20 sm:w-32 sm:h-32 text-red-600 mb-12' />
      <h1 className='text-2xl sm:text-3xl font-bold mb-3'>OTP Verification</h1>
      <p className='mb-6 text-sm sm:text-base text-gray-600 font-medium'>
        we have sent a verification code to {user?.email}.
      </p>
      <div className='flex space-x-4'>
        {[0,1,2,3,4,5].map((index) =>{
          return (
            <input key={index} type='number' maxLength={1}
            className='sm:w-20 sm:h-20 w-10 h-10 rounded-lg bg-gray-200
            text-lg sm:text-3xl font-bold outline-gray-500 text-center
            no-spinner'
            value={otp[index] || ""}
            ref = {(el) =>{inputRefs.current[index]=el}}
            onKeyDown={(event) =>handleKeyDown( event,index)}
            onChange={(event) =>handleChange(event,index)} />
          )
        })}
      </div>
      <div className='flex items-center mt-4 space-x-2'>
        <h1 className='text-sm sm:text-lg font-medium text-gray-700'>
          Didn&apos;t receive the OTP code?{" "}
        </h1>
        <button className='text-sm sm:text-lg font-medium text-blue-900 underline'
        onClick={handleResendOtp} >
          Resend Code
        </button>
      </div>
      <LoadingButton size={'lg'} className='mt-6 w-52'
      isLoading={isLoading}
      onClick={handleSubmit}>
       Verify
      </LoadingButton>
    </div>
  )
}


export default Verify