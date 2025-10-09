'use client'
import { Eye, EyeOff } from 'lucide-react';
import React from 'react'
import { useState } from 'react'

interface PasswordProps {
    name: string;
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputClassName?: string;
    labelClassName?: string;
    iconClassName?: string;
}

const PasswordInput = ({
    name, label, placeholder = 'Password',
    value, onChange, inputClassName = '',
    labelClassName = '', iconClassName = '' }: PasswordProps) => {

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div>
            {label && (
                <label className={`block font-semibold mb-2 text-sm text-foreground ${labelClassName}`}>
                    {label}
                </label>
            )}
            <div className='relative'>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    name={name}
                    className={`px-4 py-3 pr-10 
                        bg-accent/20 dark:bg-accent/10 border border-border/50 rounded-lg w-full block
                        outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200
                        ${inputClassName}`}
                />
                
              
                <button
                    type='button'
                    onClick={togglePasswordVisibility}
                    className={`absolute outline-none top-1/2 -translate-y-1/2 right-3 p-1 
                        text-muted-foreground hover:text-foreground transition-colors ${iconClassName}`}
                >
                    {showPassword ? (
                        <Eye className='h-5 w-5' />
                    ) : (
                        <EyeOff className='h-5 w-5' />
                    )}
                </button>
            </div>
        </div>
    )
}

export default PasswordInput