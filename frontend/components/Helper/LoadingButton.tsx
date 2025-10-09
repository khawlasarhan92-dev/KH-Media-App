
import React from 'react'
import { ButtonProps ,Button } from '../ui/button'
import { Loader } from 'lucide-react';

interface Props extends ButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingButton = ({ isLoading, children ,...props}: Props) => {
  return (
      <Button 
            disabled={isLoading} 
            {...props}
            className={`${props.className} ${isLoading ? 'opacity-80' : ''}`}
        >
        {isLoading ? (
            <Loader className='mr-2 w-4 h-4 animate-spin' /> 
        ) : null}
        {children}
      </Button>
  )
}

export default LoadingButton