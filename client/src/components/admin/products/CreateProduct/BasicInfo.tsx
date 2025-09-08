import React from 'react'

const BasicInfo = ({validateSection, tab}) => {
  return (
    <div>
      <div className="bg-gray-100 p-6 rounded-md space-y-4">
                  <input
                    type="text"
                    placeholder={`Enter something for ${tab.label}`}
                    onChange={(e) => validateSection(tab.id, e.target.value.length > 0)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder={`Enter something for ${tab.label}`}
                    onChange={(e) => validateSection(tab.id, e.target.value.length > 0)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder={`Enter something for ${tab.label}`}
                    onChange={(e) => validateSection(tab.id, e.target.value.length > 0)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder={`Enter something for ${tab.label}`}
                    onChange={(e) => validateSection(tab.id, e.target.value.length > 0)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder={`Enter something for ${tab.label}`}
                    onChange={(e) => validateSection(tab.id, e.target.value.length > 0)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder={`Enter something for ${tab.label}`}
                    onChange={(e) => validateSection(tab.id, e.target.value.length > 0)}
                    className="w-full p-2 border rounded"
                  />

                </div>
    </div>
  )
}

export default BasicInfo
