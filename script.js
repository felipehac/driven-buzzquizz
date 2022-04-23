const Utils = {
  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  },
};

const API = {
  allQuizzes: "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes",
  getQuizz: "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/",
};

const Home = {
  rootEl: document.querySelector("#home"),
  homeButton: document.querySelector("#home-button"),
  allQuizzesEl: document.querySelector("#all-quizzes"),
  render() {
    Quizz.hide();
    Home.show();
    Home.clear();
    axios.get(API.allQuizzes).then(function (res) {
      const quizzes = res.data;
      for (let i = 0; i < quizzes.length; i++) {
        const title = quizzes[i].title;
        const imageUrl = quizzes[i].image;
        const id = quizzes[i].id;
        Home.allQuizzesEl.innerHTML += `
          <button
          class="flex h-44 w-80 items-end rounded-lg bg-gray-400 p-4 text-white bg-cover bg-no-repeat bg-center hover:shadow-md hover:opacity-60"
          style="background-image: url('${
            imageUrl.startsWith("http") ? imageUrl : ""
          }')"
          onclick="Quizz.render(${id})"
          >
          <p class="overflow-clip text-ellipsis">${title}</p>
          </button>
          `;
      }
    });
  },
  hide() {
    Home.rootEl.classList.add("hidden");
  },
  show() {
    Home.rootEl.classList.remove("hidden");
  },
  clear() {
    Home.allQuizzesEl.innerHTML = "";
  },
};

const Quizz = {
  correctAnswers: {},
  rootEl: document.querySelector("#quizz"),
  render(id) {
    Home.hide();
    Quizz.show();
    Quizz.clear();
    axios.get(API.getQuizz + `${id}`).then(function (res) {
      const title = res.data.title;
      const imageUrl = res.data.image;
      Quizz.rootEl.innerHTML += `
        <div
          class="-mx-32 -mt-24 flex h-56 items-center justify-center bg-gray-500 text-center text-3xl text-white bg-cover bg-no-repeat bg-center font-semibold"
          style="background-image: url('${
            imageUrl.startsWith("http") ? imageUrl : ""
          }')"
        >
          ${title}
        </div>
        `;
      // Render questions
      const questions = res.data.questions;
      for (let i = 0; i < questions.length; i++) {
        // Store answers html
        const answers = Utils.shuffle(questions[i].answers);
        let answersHTML = "";
        for (let j = 0; j < answers.length; j++) {
          if (answers[j].isCorrectAnswer) {
            Quizz.correctAnswers[i] = j;
          }
          const text = answers[j].text;
          const imageUrl = answers[j].image;
          answersHTML += `
            <button class="answer w-[330px]" onclick="Quizz.checkAnswer(${i}, ${j})">
                <img src="${
                  imageUrl.startsWith("http") ? imageUrl : ""
                }" class="h-40 bg-green-300 w-full object-cover"></img src=>
                <p class="mt-1 mb-4 font-bold">${text}</p>
            </button>
            `;
        }
        const title = questions[i].title;
        Quizz.rootEl.innerHTML += `
            <div id="question_${i}" class="mt-10 flex flex-col gap-y-4 bg-white p-6 shadow-md w-[725px] mx-auto">
          <div
            class="flex items-center justify-center bg-indigo-700 py-10 text-center text-xl text-white"
          >
            ${title}
          </div>
          <div class="flex flex-wrap justify-between">
            ${answersHTML}
          </div>
        </div>
        `;
      }
    });
  },
  hide() {
    Quizz.rootEl.classList.add("hidden");
  },
  show() {
    Quizz.rootEl.classList.remove("hidden");
  },
  clear() {
    Quizz.rootEl.innerHTML = "";
  },
  checkAnswer(questionId, answerId) {
    const answersEl = document
      .querySelector(`#question_${questionId}`)
      .querySelectorAll(".answer");
    for (let i = 0; i < answersEl.length; i++) {
      answersEl[i].removeAttribute("onclick");
      if (i !== answerId) {
        answersEl[i].classList.add("opacity-40");
      }
      if (Quizz.correctAnswers[questionId] == i) {
        answersEl[i].classList.add("text-green-600");
      } else {
        answersEl[i].classList.add("text-red-600");
      }
    }
  },
};

const App = {
  init() {
    Home.homeButton.addEventListener("click", Home.render);
    Home.render();
  },
};

App.init();
