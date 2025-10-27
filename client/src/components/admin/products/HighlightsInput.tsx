// import React, { useState } from "react";

// const HighlightsInput: React.FC = () => {
//   const [input, setInput] = useState("");
//   const [highlights, setHighlights] = useState<string[]>([]);

//   const addHighlight = () => {
//     if (input.trim()) {
//       setHighlights([...highlights, input.trim()]);
//       setInput("");
//     }
//   };

//   const removeHighlight = (index: number) => {
//     setHighlights(highlights.filter((_, i) => i !== index));
//   };


//   return (
//     <div className="bg-white py-4 w-1/2">
//       <label className="mb-3">Product Highlights</label>

//       {/* Input + Button */}
//       <div className="flex gap-2 mb-3">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Enter a highlight..."
//           className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//         />
//         <button
//           type="button"
//           onClick={addHighlight}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           Add
//         </button>
//       </div>

//       {/* Highlights List */}
//       <ul className="space-y-2">
//         {highlights.map((point, idx) => (
//           <li
//             key={idx}
//             className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg"
//           >
//             <span>{point}</span>
//             <button
//               type="button"
//               onClick={() => removeHighlight(idx)}
//               className="text-red-500 hover:text-red-700"
//             >
//               ✕
//             </button>
//           </li>
//         ))}
//       </ul>

      
//     </div>
//   );
// };

// export default HighlightsInput;
