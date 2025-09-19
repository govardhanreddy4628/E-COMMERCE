import React from "react"
import { useFormContext } from "react-hook-form"

type InputFieldProps = {
  name: string
  label: string
  placeholder?: string
  type?: string
  description?: string
  required?: boolean
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder = "",
  type = "text",
  description,
  required = false,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string | undefined

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        {...register(name)}
        placeholder={placeholder}
        type={type}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {description && !error && (
        <p className="text-sm text-gray-500">{description}</p>
      )}

      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
}

export default InputField
