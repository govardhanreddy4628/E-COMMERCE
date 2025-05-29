import { TextField, TextFieldVariants } from '@mui/material';
import React from 'react'

interface props{
  
    variant : TextFieldVariants,
    label: string,
    required: boolean,
    error: boolean,
    type: string
  
}
const InputField = ({variant, label,required,error,type}:props) => {
  return (
    <div>
          <TextField type={type} variant={variant} label={label} required={required} error={error}></TextField>
    </div>
  )
}

export default InputField;   