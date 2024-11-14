import React, { useState } from "react";

const OnboardingQuestions = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      question: "¿Cuál es tu objetivo principal en nuestra aplicación?",
      options: ["Organizar tareas", "Mejorar productividad", "Seguimiento de proyectos"],
      type: "options",
    },
    {
      question: "¿Cuántos proyectos gestionas en promedio?",
      options: ["1-5", "6-10", "Más de 10"],
      type: "options",
    },
    {
      question: "¿Tienes alguna meta específica que te gustaría alcanzar?",
      type: "text",
    },
    {
      question: "¿Te gustaría recibir notificaciones?",
      options: ["Sí", "No"],
      type: "options",
    },
  ];

  const handleOptionAnswer = (answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [step]: answer,
    }));
    nextStep();
  };

  const handleTextAnswer = (e) => {
    const answer = e.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [step]: answer,
    }));
  };

  const nextStep = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onFinish(answers);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-black">Onboarding</h2>
        <p className="text-lg mb-4 text-[14px] text-black">{questions[step].question}</p>
        
        {questions[step].type === "options" && (
          <div className="flex flex-col space-y-3">
            {questions[step].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionAnswer(option)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {questions[step].type === "text" && (
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Escribe tu respuesta aquí..."
              value={answers[step] || ""}
              onChange={handleTextAnswer}
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={nextStep}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingQuestions;







