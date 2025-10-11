import React from 'react'
import { ButtonProps ,Button } from '../ui/button' 
import { Loader } from 'lucide-react';

interface Props extends ButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingButton = ({ isLoading, children ,...props}: Props) => {
  
  const combinedClassName = `${props.className} flex items-center justify-center ${isLoading ? 'opacity-80' : ''}`;

  return (
      <Button 
          disabled={isLoading} 
          {...props}
          className={combinedClassName} 
        >
        {isLoading ? (
          
            <Loader className='mr-2 w-4 h-4 animate-spin' /> 
        ) : null}
        
        <span className="w-full text-center">{children}</span> 
        
        {isLoading ? (
        
            <div className='mr-2 w-4 h-4 invisible' />
        ) : null}
      </Button>
  )
}

export default LoadingButton