import { BaseTextFieldProps, TextField } from '@mui/material';
import { Field} from 'formik';
import React from 'react'

interface InputTextFieldUIProps extends BaseTextFieldProps {
    formik: any; 
  }

const InputTextFieldUI: React.FC<InputTextFieldUIProps> = ({formik, ...rest}) => {
    
    return (
        <Field
            as={TextField}
            fullWidth
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
            {...rest}
            sx={{
                mb: 2,
                backgroundColor: 'slate',
                borderRadius: 1,
                '& .MuiInputBase-root': { // Style the input part (e.g., input text area)
                    fontSize: '16px',
                },
            }} // Styling with sx
        />
    )
}

export default InputTextFieldUI;
