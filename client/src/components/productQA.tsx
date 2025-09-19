import React, { useState } from "react";

interface QA {
  id: number;
  question: string;
  answer?: string;
}

const initialQAs: QA[] = [
  {
    id: 1,
    question: "Does this product come in red color?",
    answer:
      "Yes, it is available in red color and other colors as well for variety. jhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
  },
  {
    id: 2,
    question: "Is there a warranty?",
    answer: "Yes, 1-year warranty is provided covering manufacturing defects.",
  },
  {
    id: 3,
    question: "What is the delivery time?",
    answer: "Delivery usually takes 5-7 business days depending on your location.",
  },
  {
    id: 4,
    question: "Is cash on delivery available?",
    answer: "Yes, cash on delivery is available in selected locations.",
  },
  {
    id: 5,
    question: "Does this product require assembly?",
    answer: "Minimal assembly is required, and instructions are included.",
  },
];

const ProductQA: React.FC = () => {
  const [qas, setQAs] = useState<QA[]>(initialQAs);
  const [newQuestion, setNewQuestion] = useState("");

  const handleAddQuestion = () => {
    if (newQuestion.trim() === "") return;
    const newQA: QA = {
      id: qas.length + 1,
      question: newQuestion,
      answer: undefined,
    };
    setQAs([newQA, ...qas]);
    setNewQuestion("");
  };

  return (
    <div className="p-6 bg-gray-50 max-w-5xl pt-6">
      <h2 className="text-xl font-semibold mb-4 border-l-4 border-blue-500 pl-2">
        Questions & Answers
      </h2>
   
      {/* Scrollable Q&A list (parent container has fixed height) */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {qas.map((qa) => (
          <div key={qa.id} className="border border-gray-200 p-4 rounded-md bg-white">
            <div className="font-semibold text-gray-800">{qa.question}</div>
            {qa.answer ? (
              <div className="mt-2 bg-slate-100 inline-block max-w-[98%] p-2 rounded break-words">
                <span className="font-semibold text-gray-700">Answer: </span>
                <span className="text-sm text-gray-600">{qa.answer}</span>
              </div>
            ) : (
              <div className="text-gray-400 mt-2 italic">No answer yet.</div>
            )}
          </div>
        ))}
      </div>

      {/* Ask a Question */}
      <div>
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question about this product..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
        />
        <button
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Question
        </button>
      </div>
    </div>
  );
};

export default ProductQA;
