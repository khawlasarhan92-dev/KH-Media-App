'use client'
import React, { useState ,useRef } from 'react'
import { useDispatch ,useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LeftSidebar from '@/components/Home/LeftSidebar';
import { Sheet, SheetContent, SheetDescription,
   SheetTitle, SheetTrigger } from '../../components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoadingButton from '@/components/Helper/LoadingButton';
import PasswordInput from '@/components/Auth/PasswordInput';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '@/components/utils/apiRequest';
import { setAuthUser } from '@/store/authSlice';
import { toast } from 'sonner';


const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state:RootState)=> state.auth.user);
  const [selectedImage, setSelectedImage] = useState<string|null>(user?.profilePicture || null);
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [currentPassword , setCurrentPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarClick = () => {
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file){
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      }
    };
  

  const handleUpdateProfile = async() => {
    const formData = new FormData();
    formData.append('bio',bio);
    if(fileInputRef.current?.files?.[0]){
      formData.append('profilePicture',fileInputRef.current.files[0]);
    }
    const updateProfileReq = async() =>
      await axios.post(`${BASE_API_URL}/users/edit-profile`,
        formData,{withCredentials:true});
      const result = await handleAuthRequest(updateProfileReq,setIsLoading);
      if(result){
        dispatch(setAuthUser(result.data.data.user));
        toast.success(result.data.message);
      }
  };
  const handlePasswordChange = async(e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      currentPassword,
      newPassword,
      newPasswordConfirm
    };
    const updatePasswordReq = async() =>
      await axios.post(`${BASE_API_URL}/auth/change-password`,data,
        {withCredentials:true});
    const result = await handleAuthRequest(updatePasswordReq,setIsLoading);
    if(result){
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    }
  
    
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="w-[20%] hidden md:block border-r-2 h-screen fixed">
        <LeftSidebar />
      </div>
      <div className="flex-1 md:ml-[20%] overflow-auto flex flex-col items-center justify-center">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className='fixed top-4 left-4 z-50 bg-white rounded-full shadow-lg p-2'>
              <MenuIcon className='w-7 h-7 text-primary' />
            </SheetTrigger>
            <SheetContent side='left' className='p-0 w-[80vw] max-w-xs'>
              <SheetTitle className='hidden'></SheetTitle>
              <SheetDescription className='hidden'></SheetDescription>
              <LeftSidebar />
            </SheetContent>
          </Sheet>
        </div>
        <div className="w-full max-w-2xl mx-auto p-6 md:p-10 bg-white rounded-2xl shadow-md mt-10 mb-16 flex flex-col gap-10">
          <h1 className="text-3xl font-bold text-center mb-2 text-primary">Edit Profile</h1>
          {/* صورة البروفايل وتغييرها */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="w-36 h-36 border-4 border-primary/20 shadow-lg">
                <AvatarImage src={selectedImage || ''} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <LoadingButton
              isLoading={isLoading}
              size={'lg'}
              className="bg-primary w-full rounded-full text-base font-bold shadow-sm hover:bg-primary/90 transition"
              onClick={handleUpdateProfile}
            >
              Change Profile Picture
            </LoadingButton>
          </div>
          {/* البايو */}
          <div className="flex flex-col gap-4">
            <label htmlFor="bio" className="block text-lg font-bold mb-1 flex items-center gap-2">
              Bio
              <span className="text-primary text-xl">📝</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="h-28 bg-gray-100 w-full outline-none p-4 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 text-base transition"
            />
            <LoadingButton
              isLoading={isLoading}
              size={'lg'}
              className="mt-2 w-full rounded-full text-base font-bold shadow-sm bg-primary hover:bg-primary/90 transition"
              onClick={handleUpdateProfile}
            >
              Change Bio
            </LoadingButton>
          </div>
          {/* تغيير كلمة المرور */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Change Password <span className="text-primary text-xl">🔒</span>
            </h2>
            <form className="mt-4 mb-2 flex flex-col gap-4" onSubmit={handlePasswordChange}>
              <PasswordInput
                name="currentPassword"
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <PasswordInput
                name="newPassword"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <PasswordInput
                name="confirmNewPassword"
                label="Confirm New Password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />
              <LoadingButton
                isLoading={isLoading}
                type="submit"
                className="bg-red-700 w-full rounded-full text-base font-bold shadow-sm hover:bg-red-800 transition mt-2"
              >
                Change Password
              </LoadingButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile