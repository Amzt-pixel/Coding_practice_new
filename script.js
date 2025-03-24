let questions = [];
let currentQuestion = 0;
let score = 0;
let attempted = 0;
let wrongAnswers = 0;
let selectedAnswer = null;
let timeLeft;
let timerRunning = false;
let testStartTime, testEndTime;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM"; // Custom looping system

function startTest() {
    let numQuestions = document.getElementById("numQuestions").value;
    let setMinutes = document.getElementById("setTimer").value;
    let upperLimit = document.getElementById("upperLimit").value;

    if (numQuestions < 1 || setMinutes < 1 || upperLimit < 1 || upperLimit >= 14) {
        alert("Enter valid values!");
        return;
    }

    timeLeft = setMinutes * 60;
    testStartTime = new Date(); // Start clock

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
                    `Time up! You attempted ${attempted} questions till now. Practice more, you will do better.`;
                document.getElementById("timeUpMessage").style.color = "navy"; // Navy Blue message
                timerRunning = false;
                submitTest();
            }
        }
    }, 1000);
}

function generateQuestions(num, upperLimit) {
    questions = [];
    for (let i = 0; i < num; i++) {
        let letterIndex = Math.floor(Math.random() * 39);
        let letter = alphabet[letterIndex];
        let number = Math.floor(Math.random() * upperLimit) + 1;
        let isAddition = Math.random() < 0.5;

        let answer;
        let questionText;

        if (isAddition) {
            answer = alphabet[letterIndex + number];
            questionText = `${letter} + ${number} = ?`;
        } else {
            let adjustedIndex = letterIndex;
            if (letterIndex < number) {
                let alternativeIndex = letterIndex + 26;
                if (alternativeIndex >= number) {
                    adjustedIndex = alternativeIndex;
                } else {
                    answer = alphabet[letterIndex + number];
                    questionText = `${letter} + ${number} = ?`;
                    questions.push({ question: questionText, answer });
                    continue;
                }
            }
            answer = alphabet[adjustedIndex - number];
            questionText = `${letter} - ${number} = ?`;
        }

        questions.push({ question: questionText, answer });
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
    document.querySelectorAll("#options button").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    selectedAnswer = answer;
}

function saveAnswer() {
    if (selectedAnswer === null) return;

    attempted++;
    let correctAnswer = questions[currentQuestion].answer;

    if (selectedAnswer === correctAnswer) {
        document.getElementById("feedback").innerText = "Very Good! Your answer is correct!";
        document.getElementById("feedback").style.color = "green"; // Green for correct
        score++;
    } else {
        document.getElementById("feedback").innerText = `Oops! That was wrong! Correct answer: ${correctAnswer}`;
        document.getElementById("feedback").style.color = "red"; // Red for wrong
        wrongAnswers++;
    }

    document.querySelectorAll("#options button").forEach(btn => btn.disabled = true);

    if (attempted === questions.length) {
        submitTest();
    }
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        submitTest();
    }
}

function submitTest() {
    testEndTime = new Date();
    let timeTaken = Math.floor((testEndTime - testStartTime) / 1000);
    let minutes = Math.floor(timeTaken / 60);
    let seconds = timeTaken % 60;

    document.getElementById("test").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("score").innerText = `Correct: ${score}`;
    document.getElementById("wrongAnswers").innerText = `Wrong: ${wrongAnswers}`;
    document.getElementById("unattempted").innerText = `Unattempted: ${questions.length - attempted}`;
    document.getElementById("timeTaken").innerText = `Total Time: ${minutes} min ${seconds} sec`;
}
