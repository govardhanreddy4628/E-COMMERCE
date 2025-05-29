import React, { useEffect } from 'react'
import { obj } from './FaqComp'

const FaqItem = ({faq, index, isShow, setIsShow}: {faq:obj,index:number,isShow:number|null, setIsShow:(i:number|null)=>void}) => {
   

    useEffect(()=>{
        if(index == 0){
            setIsShow(1)
        }
    },[])

  return (
    <div className='bg-gray-300 m-4 rounded-md text-left p-3 pb-2 text-rgb(0,255,234)'>
      <div className='font-bold cursor-pointer flex justify-left align-center text-xl' onClick={()=>{if(isShow!==index){setIsShow(index)} else{setIsShow(null)}}}>
        <button className={`h-5 w-10 bg-gray-300 text-xl font-bold cursor-pointer text-purple-400 ${isShow===index ? 'transform rotate-90' : ''}`}>{">"}</button>
        <div>{faq.question}</div>
      </div>
      {isShow===index && <div className='mt-5 bg-purple-300 rounded-md text-left p-4 text-rgb(0,255,234)'>{faq.answer}</div>}
    </div>
  )
}

export default FaqItem






// import React from 'react';
// import { obj } from './FaqComp';

// const FaqItem = ({ faq, index, isExpanded, toggleFaq }: { faq: obj; index: number; isExpanded: boolean; toggleFaq: (index: number) => void }) => {
//   return (
//     <div className='bg-gray-300 m-4 rounded-md text-left p-3 pb-2 text-rgb(0,255,234)'>
//       <div
//         className='font-bold cursor-pointer flex justify-left items-center text-xl'
//         onClick={() => toggleFaq(index)} // Toggle visibility when clicked
//       >
//         <button
//           className={`h-5 w-10 bg-gray-300 text-xl font-bold cursor-pointer text-purple-400 ${isExpanded ? 'transform rotate-90' : ''}`}
//         >
//           {">"}
//         </button>
//         <div>{faq.question}</div>
//       </div>
//       {isExpanded && (
//         <div className='mt-5 bg-purple-300 rounded-md text-left p-4 text-rgb(0,255,234)'>
//           {faq.answer}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FaqItem;






// const AccordionItem = ({ question, answer }) => {
//     const [isOpen, setIsOpen] = useState(false);
  
//     const toggleAccordion = () => {
//       setIsOpen(!isOpen);
//     };
  
//     return (
//       <div className="accordion-item">
//         <div className="accordion-header" onClick={toggleAccordion}>
//           {question}
//         </div>
//         {isOpen && <div className="accordion-content">{answer}</div>}
//       </div>
//     );
//   };

