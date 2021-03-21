const url = "https://tonyquizdb-sjiqe.ondigitalocean.app/questions";

// ******************************
// ******************************
// VALIDATION FUNCTIONS
// ******************************
// ******************************

// to check if the question is string and valid
// param: q, question, any
// return: if true, string value of q
//         if false, false
function questionChecker(q) {
  return typeof q === "string" && q;
}

// to check if the option is valid
// param: o, option, an array
// return: true or false
function optionChecker(o) {
  return (
    o.length >= 2 &&
    o.length <= 4 &&
    o.filter(({ isCorrect }) => isCorrect).length === 1 // filter() returns an array, there should be only answer (true)
  );
}

// to filter the option array
// param: o, option, an array
// return: a new array of the option array
function filterOptionArray(o) {
  return o.filter(({ question_answer, isCorrect }) => {
    if (question_answer == null && isCorrect) {
      return false;
    }
    return question_answer !== "";
  });
}

// ******************************
// ******************************
// CRUD FUNCTIONS
// ******************************
// ******************************

// when 'add' button's onClick happened
const createQuestions = async (question_text, question_options) => {
  if (!questionChecker(question_text)) {
    return Promise.reject({ message: "Invalid question" });
  }

  const filteredOption = filterOptionArray(question_options);

  if (!optionChecker(filteredOption)) {
    return Promise.reject({ message: "invalid options" });
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question_text, question_options: filteredOption }),
  });

  const data = res.json();

  return data;
};

const readQuestions = async () => {
  const res = await fetch(url, {
    method: "GET",
    mode: "cors",
  });

  const questions = await res.json();
  return questions;
};

// when 'save' or 'update' button's onClick happened
const updateQuestions = async (questionID, question_text, question_options) => {
  if (!questionChecker(question_text)) {
    return Promise.reject({ message: "Invalid question" });
  }

  if (!optionChecker(question_options)) {
    return Promise.reject({ message: "invalid options" });
  }

  if (!question_options.every(({ id }) => id != null)) {
    return Promise.reject({ message: "option must have an id" });
  }

  if (!question_options.every(({ question_answer }) => question_answer)) {
    return Promise.reject({ message: "Answer cannot be blank" });
  }

  const res = await fetch(url, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: questionID,
      question_text,
      question_options,
    }),
  });

  const data = res.json();

  console.log(data);
  return data;
};

// ******************************
// ******************************
// HTML QUERY SELECTOR HELPER FUNCTION
// ******************************
// ******************************
const getElement = (selector) => document.querySelector(selector);

const createElement = (tag, { text = "", classes = [], ...rest } = {}) => {
  const element = document.createElement(tag);

  if (text) {
    element.innerText = text;
  }

  if (classes.length !== 0) {
    element.classList.add(...classes);
  }

  for (key in rest) {
    element[key] = rest[key];
  }

  return element;
};

const addElement = (root, ...elements) =>
  elements.forEach((element) => root.appendChild(element));
