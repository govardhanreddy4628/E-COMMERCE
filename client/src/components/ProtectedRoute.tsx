import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = () => {
    const navigate = useNavigate();
    navigate("/counter")

  return (
    <div>
      
    </div>
  )
}

export default ProtectedRoute
