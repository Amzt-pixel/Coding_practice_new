let questions = [];
let currentQuestion = 0;
let correctCount = 0;
let wrongCount = 0;
let attempted = 0;
let selectedAnswer = null;
let timerRunning = false;
let timeLeft;
let extraTime = 0;
let testStartTime;

// Custom looping alphabet system (A-Z then continues A-M)
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM";

function startTest() {
    let numQuestions = parseInt(document.getElementById("numQuestions").value);
    let maxInt = parseInt(document.getElementById("maxInt").value);
    let setMinutes = parseInt(document.getElementById("setTimer").value);

    if (numQuestions < 1 || maxInt < 1 || maxInt >= 14 || setMinutes < 1) {
        alert("Enter valid values! (Max integer must be less than 14)");
        return;
    }

    timeLeft = setMinutes * 60;
    testStartTime = new Date(); // Start hidden clock
    generateQuestions(numQuestions, maxInt);

    document.getElementById("setup").style.display = "none";
    document.getElementById("test").style.display = "block";

    startTimer();
    loadQuestion();
}

function startTimer() {
    timerRunning = true;
    let timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById("timeLeft").innerText =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            if (timerRunning) {
                document.getElementById("timeUpMessage").innerText =
                    `Time up! You attempted ${attempted} questions. Keep practicing!`;
                document.getElementById("timeUpMessage").style.color = "navy";
                timerRunning = false;
                submitTest(); // Auto-submit on timeout
            }
            extraTime++;
        }
    }, 1000);
}

function generateQuestions(num, maxInt) {
    questions = [];
    for (let i = 0; i < num; i++) {
        let letterIndex = Math.floor(Math.random() * 39); // Full range of alphabet
        let letter = alphabet[letterIndex];
        let num = Math.floor(Math.random() * maxInt) + 1;
        let operation = Math.random() < 0.5 ? " + " : " - ";
        let answerIndex;

        if (operation === " + ") {
            answerIndex = letterIndex + num;
        } else {
            answerIndex = letterIndex - num;
            if (answerIndex < 0) answerIndex += 39; // Ensure valid looping alphabet subtraction
        }

        let answer = alphabet[answerIndex];
        questions.push({ question: `${letter}${operation}${num} = ?`, answer });
    }
}

function loadQuestion() {
    let q = questions[currentQuestion];
    document.getElementById("questionNumber").innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
    document.getElementById("question").innerText = q.question;
    document.getElementById("options").innerHTML = "";

    let options = [q.answer, ...generateWrongOptions(q.answer)];
    options.sort(() => Math.random() - 0.5);

    options.forEach(option => {
        let btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => selectOption(btn, option);
        document.getElementById("options").appendChild(btn);
    });

    document.getElementById("feedback").innerText = "";
}

function generateWrongOptions(correct) {
    let options = [];
    while (options.length < 3) {
        let rand = alphabet[Math.floor(Math.random() * 39)];
        if (!options.includes(rand) && rand !== correct) options.push(rand);
    }
    return options;
}

function selectOption(button, answer) {
    if (document.querySelector(".saved")) return; // Prevent changes after saving

    document.querySelectorAll("#options button").forEach(btn => {
        btn.classList.remove("selected");
    });
    button.classList.add("selected");
    selectedAnswer = answer;
}

function saveAnswer() {
    if (selectedAnswer === null) return;

    attempted++;
    let correctAnswer = questions[currentQuestion].answer;
    let feedbackElement = document.getElementById("feedback");

    if (selectedAnswer === correctAnswer) {
        feedbackElement.innerText = "Correct!";
        feedbackElement.style.color = "green";
        correctCount++;
    } else {
        feedbackElement.innerText = `Wrong! Correct answer: ${correctAnswer}`;
        feedbackElement.style.color = "red";
        wrongCount++;
    }

    // Lock answer so it can't be changed
    document.querySelectorAll("#options button").forEach(btn => btn.classList.add("saved"));

    // Auto-move to the next question
    setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        submitTest();
    }
}

function submitTest() {
    document.getElementById("test").style.display = "none";
    document.getElementById("result").style.display = "block";

    let totalTimeTaken = Math.floor((new Date() - testStartTime) / 1000);
    let minutes = Math.floor(totalTimeTaken / 60);
    let seconds = totalTimeTaken % 60;

    document.getElementById("score").innerText = `Correct: ${correctCount}`;
    document.getElementById("wrong").innerText = `Wrong: ${wrongCount}`;
    document.getElementById("unattempted").innerText = `Unattempted: ${questions.length - attempted}`;
    document.getElementById("timeTaken").innerText = `Total Time Taken: ${minutes} min ${seconds} sec`;
}
