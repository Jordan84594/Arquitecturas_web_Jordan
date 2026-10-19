const questions = [
  {
    question: "¿Qué caracteriza principalmente a una arquitectura de microservicios?",
    answers: [
      "Una aplicación compuesta por servicios pequeños e independientes.",
      "Una sola aplicación donde todas las funciones están unidas.",
      "Una aplicación que no necesita comunicarse con otros sistemas."
    ],
    correct: 0,
    explanation: "¡Exacto! Cada microservicio se ocupa de una capacidad y puede evolucionar por separado."
  },
  {
    question: "¿Cómo suelen comunicarse los microservicios entre sí?",
    answers: [
      "Únicamente editando los mismos archivos de código.",
      "Mediante contratos definidos, como APIs y mensajes.",
      "No se comunican: cada uno funciona sin colaborar."
    ],
    correct: 1,
    explanation: "Así es: APIs y mensajes permiten colaborar con límites y contratos claros."
  },
  {
    question: "¿Qué ventaja puede ofrecer separar una aplicación en servicios?",
    answers: [
      "Eliminar la necesidad de supervisar el sistema.",
      "Garantizar que ningún servicio tendrá errores.",
      "Escalar de forma independiente el servicio con más demanda."
    ],
    correct: 2,
    explanation: "Correcto. Se pueden asignar recursos a un servicio sin escalar toda la aplicación."
  },
  {
    question: "¿Cuál es un reto habitual de los microservicios?",
    answers: [
      "Coordinar comunicación, datos y operación entre servicios.",
      "No poder desplegar cambios de manera independiente.",
      "Tener que usar una sola tecnología en todos los servicios."
    ],
    correct: 0,
    explanation: "¡Bien! La distribución ofrece flexibilidad, pero añade complejidad operativa."
  },
  {
    question: "¿Cuándo puede ser más conveniente empezar con un monolito?",
    answers: [
      "Cuando cada equipo debe desplegarse a un ritmo distinto.",
      "Cuando el producto es pequeño y se busca simplicidad inicial.",
      "Cuando se requiere escalar solo una parte de la aplicación."
    ],
    correct: 1,
    explanation: "Exacto. Un monolito puede ser una opción sencilla y válida para empezar."
  }
];

const questionText = document.querySelector("#question-text");
const answerList = document.querySelector("#answer-list");
const answerFeedback = document.querySelector("#answer-feedback");
const nextButton = document.querySelector("#next-question");
const restartButton = document.querySelector("#restart-quiz");
const scoreElement = document.querySelector("#score");
const questionTotal = document.querySelector("#question-total");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#quiz-progress-bar");
const progressTrack = document.querySelector(".quiz-progress");
const scoreMessage = document.querySelector("#score-message");
const quizContent = document.querySelector("#quiz-content");
const quizComplete = document.querySelector("#quiz-complete");
const completeTitle = document.querySelector("#complete-title");
const completeMessage = document.querySelector("#complete-message");
const currentYear = document.querySelector("#current-year");

let currentQuestion = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const item = questions[currentQuestion];
  answered = false;
  questionText.textContent = item.question;
  answerFeedback.textContent = "";
  answerFeedback.className = "answer-feedback";
  nextButton.disabled = true;
  nextButton.innerHTML = currentQuestion === questions.length - 1
    ? "Ver resultado <span aria-hidden=\"true\">→</span>"
    : "Siguiente pregunta <span aria-hidden=\"true\">→</span>";
  progressLabel.textContent = `PREGUNTA ${currentQuestion + 1} DE ${questions.length}`;
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(currentQuestion));

  answerList.replaceChildren();
  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span class="answer-copy"></span>`;
    button.querySelector(".answer-copy").textContent = answer;
    button.addEventListener("click", () => selectAnswer(index));
    answerList.append(button);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;

  answered = true;
  const item = questions[currentQuestion];
  const options = answerList.querySelectorAll(".answer-option");
  const isCorrect = selectedIndex === item.correct;

  options.forEach((option, index) => {
    option.disabled = true;
    if (index === item.correct) option.classList.add("is-correct");
    if (index === selectedIndex && !isCorrect) option.classList.add("is-incorrect");
  });

  if (isCorrect) {
    score += 1;
    scoreElement.textContent = String(score);
    scoreMessage.textContent = score === questions.length ? "¡Impecable!" : "¡Vas muy bien!";
    answerFeedback.textContent = item.explanation;
    answerFeedback.classList.add("feedback-correct");
  } else {
    answerFeedback.textContent = `No exactamente. ${item.explanation}`;
    answerFeedback.classList.add("feedback-incorrect");
  }

  nextButton.disabled = false;
  nextButton.focus();
}

function showResult() {
  quizContent.classList.add("d-none");
  quizComplete.classList.remove("d-none");
  progressLabel.textContent = "CUESTIONARIO COMPLETADO";
  progressBar.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", String(questions.length));

  if (score === questions.length) {
    completeTitle.textContent = "¡Dominaste el tema!";
    completeMessage.textContent = `Respondiste correctamente las ${questions.length} preguntas. ¡Sigue explorando!`;
    scoreMessage.textContent = "¡Todas correctas!";
  } else if (score >= Math.ceil(questions.length * 0.6)) {
    completeTitle.textContent = "¡Buen trabajo!";
    completeMessage.textContent = `Acertaste ${score} de ${questions.length}. Ya tienes una buena base sobre microservicios.`;
    scoreMessage.textContent = "¡Buen progreso!";
  } else {
    completeTitle.textContent = "¡Cada intento suma!";
    completeMessage.textContent = `Acertaste ${score} de ${questions.length}. Repasa los conceptos y vuelve a intentarlo.`;
    scoreMessage.textContent = "¡Sigue aprendiendo!";
  }

  restartButton.focus();
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  scoreElement.textContent = "0";
  scoreMessage.textContent = "¡Tú puedes!";
  quizComplete.classList.add("d-none");
  quizContent.classList.remove("d-none");
  renderQuestion();
  questionText.focus();
}

nextButton.addEventListener("click", () => {
  if (!answered) return;
  if (currentQuestion === questions.length - 1) {
    showResult();
    return;
  }
  currentQuestion += 1;
  renderQuestion();
  questionText.focus();
});

restartButton.addEventListener("click", restartQuiz);
questionTotal.textContent = String(questions.length);
currentYear.textContent = String(new Date().getFullYear());
renderQuestion();
