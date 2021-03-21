"use strict";

const getQuestionsDiv = (questions) => {
  return questions.flatMap(({ id, question_text, options = [] }, index) => {
    const heading = createElement("h3", {
      text: `Question ${index + 1}`,
      classes: ["textTitle"],
    });
    const questionElement = createElement("div", {
      id: `question-${id}`,
      text: question_text,
      classes: ["question"],
    });

    const br = createElement("br");

    const optionsElements = options.flatMap(
      ({ id: optionID, question_answer }) => {
        const br = createElement("br");
        const optionElement = createElement("input", {
          id: `option-${optionID}`,
          classes: ["radioBtn"],
          value: optionID,
          name: `question-${id}`,
          type: "radio",
          readOnly: true,
          required: true,
        });

        const label = createElement("label", {
          htmlFor: `option-${optionID}`,
          text: question_answer,
          classes: ["answerText"],
        });

        return [optionElement, label, br];
      }
    );

    return [heading, questionElement, br, ...optionsElements];
  });
};

const evaluate = (submittedAnswers, questions) => {
  const corrects = questions.flatMap(({ options }) => {
    return options.filter(({ isCorrect }) => isCorrect).map(({ id }) => id);
  });

  return submittedAnswers.reduce((acc, submittedAnswer, index) => {
    return acc + (submittedAnswer == corrects[index] ? 1 : 0);
  }, 0);
};

const getCheckedInputs = (questions) => {
  const userAnswers = questions.map(({ id }) => {
    return getElement(`input[name="question-${id}"]:checked`);
  });
  return userAnswers;
};

window.addEventListener("load", async () => {
  const root = getElement("#main");

  const questions = await readQuestions();
  // console.log(
  //   "this is the questions I'm getting in student page" +
  //     JSON.stringify(questions)
  // );

  const questionsElements = getQuestionsDiv(questions);

  const submitBtn = createElement("button", {
    text: "Submit",
    id: "submit-btn",
    classes: ["submitBtn"],
  });

  const backBtn = createElement("button", {
    text: "Back",
    classes: ["backBtn"],
    onclick: () => history.back(),
  });

  addElement(
    root,
    backBtn,
    createElement("h1", { text: "Questions", classes: ["pageTitle"] }),
    ...questionsElements,
    submitBtn
  );

  submitBtn.addEventListener("click", () => {
    const checkedInput = getCheckedInputs(questions);
    const userAnswers = checkedInput.map((checked) => checked && checked.value);

    const score = evaluate(userAnswers, questions);
    checkedInput.forEach((checked) => {
      if (checked) {
        checked.checked = false;
      }
    });
    window.alert(
      `Quiz successfully submitted. Your score is ${score} / ${questions.length}`
    );
  });
});
