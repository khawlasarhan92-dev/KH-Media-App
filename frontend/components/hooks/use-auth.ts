import { BASE_API_URL } from "@/server";
import axios from "axios";
import { useDispatch , useSelector } from "react-redux"
import { handleAuthRequest } from "../utils/apiRequest";
import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";
import { RootState } from "@/store/store"

export  const useFollowUnfollow = () =>{

  const dispatch = useDispatch();
   const currentUser = useSelector((state: RootState) => state.auth.user); 

  const handleFollowUnfollow = async(userId:string) =>{
    if (!currentUser) {
            toast.error("يجب تسجيل الدخول لإجراء هذه العملية.");
            return;
        }
    const isCurrentlyFollowing = currentUser.following.includes(userId);   
    const followUnfollowReq = async() =>{
      if (isCurrentlyFollowing) {
              
                return await axios.delete(`${BASE_API_URL}/users/follow/${userId}`, 
                    { withCredentials: true }
                );
            } else {
              return await axios.post(`${BASE_API_URL}/users/follow/${userId}`, 
                    {}, { withCredentials: true }
                );
            }
          };

    const result = await handleAuthRequest(followUnfollowReq);
    
    if(result?.data.status === 'success'){
     
            const updatedFollowing = isCurrentlyFollowing
                ? currentUser.following.filter(id => id !== userId) 
                : [...currentUser.following, userId]; 

            const updatedUser = {
                ...currentUser,
                following: updatedFollowing
            };
        dispatch(setAuthUser(updatedUser));
          toast.success(result.data.message ||
            (isCurrentlyFollowing 
          ? 'تم إلغاء المتابعة' 
          : 'تمت المتابعة بنجاح'));
    }

  };
  return {handleFollowUnfollow};
};