// method-1 this method has drawback it does not open multiple accordial item at a time
import React, { useState } from 'react'
import FaqItem from './FaqItem'

export interface obj{
    question:string, answer:string
}

const FaqComp = () => {
    const [isShow, setIsShow] = useState<number|null>(null);
    const faqs: obj[] = [{question:"how many bones", answer:"a cat has 230 bones"}, {question:"how many bones", answer:"a cat has 230 bones"}, {question:"how many bones", answer:"a cat has 230 bones"}]
  return (
    <div>
      {faqs.map((faq, index)=>{
        return <FaqItem faq={faq} index={index} key={index} isShow={isShow} setIsShow={setIsShow}/>
      })}
    </div>
  )
}

export default FaqComp




//method-2
// import React, { useState } from 'react';
// import FaqItem from './FaqItem';

// export interface obj {
//   question: string;
//   answer: string;
// }

// const FaqComp = () => {
//   // Track expanded FAQ items in a Set to easily manage multiple expanded states
//   const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

//   const faqs: obj[] = [
//     { question: "How many bones?", answer: "A cat has 230 bones" },
//     { question: "How many bones?", answer: "A cat has 230 bones" },
//     { question: "How many bones?", answer: "A cat has 230 bones" },
//   ];

//   // Toggle the visibility of a FAQ item
//   const toggleFaq = (index: number) => {
//     setExpandedItems((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(index)) {
//         newSet.delete(index);
//       } else {
//         newSet.add(index);
//       }
//       return newSet;
//     });
//   };

//   return (
//     <div>
//       {faqs.map((faq, index) => {
//         return (
//           <FaqItem
//             key={index}
//             faq={faq}
//             index={index}
//             isExpanded={expandedItems.has(index)}
//             toggleFaq={toggleFaq}
//           />
//         );
//       })}
//     </div>
//   );
// };

// export default FaqComp;






//method-3
// const Accordion = () => {
//     const data = [
//       { question: "How many bones?", answer: "A cat has 230 bones." },
//       { question: "How many bones?", answer: "A cat has 230 bones." },
//       { question: "How many bones?", answer: "A cat has 230 bones." }
//     ];
  
//     return (
//       <div className="accordion">
//         {data.map((item, index) => (
//           <AccordionItem
//             key={index}
//             question={item.question}
//             answer={item.answer}
//           />
//         ))}
//       </div>
//     );
//   };
  
//   export default Accordion;