let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let attempted = 0;
let selectedAnswer = null;
let totalQuestions;
let startTime;
let timerRunning = false;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM"; 

function startTest() {
    let numQuestions = document.getElementById("numQuestions").value;
    let upperLimit = document.getElementById("upperLimit").value;
    let setMinutes = document.getElementById("setTimer").value;

    if (numQuestions < 1 || upperLimit >= 14 || setMinutes < 1) {
        alert("Enter valid values!");
        return;
    }

    totalQuestions = parseInt(numQuestions);
    startTime = new Date();
    generateQuestions(totalQuestions, parseInt(upperLimit));

    document.getElementById("setup").style.display = "none";
    document.getElementById("test").style.display = "block";

    startTimer(setMinutes);
    loadQuestion();
}

function startTimer(minutes) {
    let timeLeft = minutes * 60;
    let timerElement = document.getElementById("timer");

    timerRunning = true;
    let timerInterval = setInterval(() => {
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        document.getElementById("timeLeft").innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            if (timerRunning) {
                let message = document.getElementById("timeUpMessage");
                message.innerText = "Time up! Test continues until all questions are attempted.";
                message.classList.add("red-border");
                timerElement.classList.add("red-border");
                timerRunning = false;
            }
        }
    }, 1000);
}

function generateQuestions(num, upperLimit) {
    questions = [];
    for (let i = 0; i < num; i++) {
        let letter = alphabet[Math.floor(Math.random() * 26)];
        let num = Math.floor(Math.random() * upperLimit) + 1;
        let operation = Math.random() < 0.5 ? "+" : "-";
        let answerIndex;

        if (operation === "+") {
            answerIndex = alphabet.indexOf(letter) + num;
        } else {
            answerIndex = alphabet.indexOf(letter) - num;
            if (answerIndex < 0) answerIndex += 39;
        }

        let answer = alphabet[answerIndex];
        questions.push({ question: `${letter} ${operation} ${num} = ?`, answer });
    }
}

function loadQuestion() {
    let q = questions[currentQuestion];
    document.getElementById("questionNumber").innerText = `Question ${currentQuestion + 1} of ${totalQuestions}`;
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
    document.getElementById("feedback").classList.remove("blue-border");
}

function generateWrongOptions(correct) {
    let options = [];
    while (options.length < 3) {
        let rand = alphabet[Math.floor(Math.random() * 26)];
        if (!options.includes(rand) && rand !== correct) options.push(rand);
    }
    return options;
}

function selectOption(button, answer) {
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
    let feedback = document.getElementById("feedback");

    if (selectedAnswer === correctAnswer) {
        feedback.innerText = "Very Good! Your answer is correct!";
        feedback.style.color = "green";
        correctAnswers++;
    } else {
        feedback.innerText = `Oops! That was wrong! Correct answer: ${correctAnswer}`;
        feedback.style.color = "red";
        wrongAnswers++;
    }

    feedback.classList.add("blue-border");

    // Disable further changes
    document.querySelectorAll("#options button").forEach(btn => btn.onclick = null);
}

function nextQuestion() {
    if (currentQuestion + 1 < totalQuestions) {
        currentQuestion++;
        loadQuestion();
    } else {
        submitTest();
    }
}

function submitTest() {
    document.getElementById("test").style.display = "none";
    document.getElementById("result").style.display = "block";

    let timeTaken = ((new Date()) - startTime) / 1000;
    let minutes = Math.floor(timeTaken / 60);
    let seconds = Math.floor(timeTaken % 60);

    document.getElementById("score").innerText = `Correct: ${correctAnswers}`;
    document.getElementById("wrong").innerText = `Wrong: ${wrongAnswers}`;
    document.getElementById("unattempted").innerText = `Unattempted: ${totalQuestions - attempted}`;
    document.getElementById("timeTaken").innerText = `Total Time Taken: ${minutes} min ${seconds} sec`;

    document.getElementById("result").classList.add("exit-border");
}
