let questions = [];
let currentQuestion = 0;
let score = 0;
let wrongAnswers = 0;
let attempted = 0;
let selectedAnswer = null;
let timeLeft;
let extraTime = 0;
let timerRunning = false;
let testStartTime;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM"; // Custom looping system

function startTest() {
    let numQuestions = parseInt(document.getElementById("numQuestions").value);
    let upperLimit = parseInt(document.getElementById("upperLimit").value);
    let setMinutes = parseInt(document.getElementById("setTimer").value);

    if (numQuestions < 1 || upperLimit < 1 || upperLimit >= 14 || setMinutes < 1) {
        alert("Enter valid values!");
        return;
    }

    timeLeft = setMinutes * 60;
    testStartTime = new Date(); // Start tracking time

    generateQuestions(numQuestions, upperLimit);

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
                    `Time up! You attempted ${attempted} questions till now.`;
                timerRunning = false;
            }
            extraTime++;
        }
    }, 1000);
}

function generateQuestions(num, upperLimit) {
    questions = [];
    while (questions.length < num) {
        let letter = alphabet[Math.floor(Math.random() * 39)];
        let num = Math.floor(Math.random() * upperLimit) + 1;
        let isAddition = Math.random() < 0.5;

        let answerIndex;
        if (isAddition) {
            answerIndex = alphabet.indexOf(letter) + num;
        } else {
            let originalIndex = alphabet.indexOf(letter);
            answerIndex = (originalIndex >= 26) ? originalIndex - num : originalIndex + 13 - num;
        }

        if (answerIndex >= 0 && answerIndex < 39) {
            let answer = alphabet[answerIndex];
            let operation = isAddition ? "+" : "-";
            questions.push({ question: `${letter} ${operation} ${num} = ?`, answer });
        }
    }
}

function loadQuestion() {
    if (attempted >= parseInt(document.getElementById("numQuestions").value)) {
        submitTest();
        return;
    }

    let q = questions[currentQuestion];
    document.getElementById("questionNumber").innerText = `Question ${attempted + 1}`;
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

function saveAnswer() {
    if (selectedAnswer === null) return;

    attempted++;
    let correctAnswer = questions[currentQuestion].answer;

    if (selectedAnswer === correctAnswer) {
        document.getElementById("feedback").innerText = "Correct!";
        score++;
    } else {
        document.getElementById("feedback").innerText = `Wrong! Correct answer: ${correctAnswer}`;
        wrongAnswers++;
    }
}

function submitTest() {
    document.getElementById("test").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("score").innerText = `Correct: ${score}`;
    document.getElementById("wrongAnswers").innerText = `Wrong: ${wrongAnswers}`;
}
