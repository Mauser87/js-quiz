const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let curretQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestion = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions.results);
        questions = loadedQuestions.results.map(loadedQuestions => {
            const formatedQuestion = {
                question: loadedQuestions.question
            };
            const answerChoices = [...loadedQuestions.incorrect_answers];
            formatedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(formatedQuestion.answer - 1, 0, loadedQuestions.correct_answer);

            answerChoices.forEach((choice, index) => {
                formatedQuestion["choice" + (index + 1)] = choice;
            })
            return formatedQuestion;
        });

        startGame();
    })
    .catch(err => {
        console.error(err);
    });
//CONSTANTS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestion = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuestion.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to end page
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter} /${MAX_QUESTIONS}`;
    //Update the progress  bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestion.length);
    curretQuestion = availableQuestion[questionIndex];
    question.innerText = curretQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = curretQuestion["choice" + number];
    });

    availableQuestion.splice(questionIndex, 1);
    acceptingAnswer = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswer) return;

        acceptingAnswer = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];


        const calssToApply = selectedAnswer == curretQuestion.answer ? 'correct' : 'incorrect';

        if (calssToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(calssToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(calssToApply);
            getNewQuestion();

        }, 1000);
    });
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};