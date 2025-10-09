import { AxiosError } from "axios";
import { toast } from "sonner";


interface ApiErrorResponse {
  message: string;
}

export const handleAuthRequest = async<T>(requestCallback:() => Promise<T> ,
setLoading?: (loading: boolean) => void): Promise<T | null> => {

  if (setLoading) setLoading(true);
  try {
    const response = await requestCallback();
    return response;
    
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
     const statusCode = axiosError.response?.status;
    console.log(error);
    if (statusCode === 401 || statusCode === 403) {

    }

    else if (axiosError?.response?.data?.message) {
      console.log(axiosError.response.data.message);
      
      toast.error(axiosError.response.data.message);
    }else{
      toast.error('An unexpected error occurred. Please try again.');
    }
    return null;
    
    
  }finally{
    if (setLoading) setLoading(false);
  }

}; 