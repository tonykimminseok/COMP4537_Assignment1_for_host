"use strict";

const makeQuestionForm = () => {
  const heading = createElement("h3", {
    text: "Create a new question",
    classes: ["adminHeader"],
  });
  const hr = createElement("hr");

  const questionTextArea = createElement("textarea", {
    classes: ["questionTextField"],
    placeholder: "What is your quiz?",
  });

  const firstCheckBox = createElement("input", {
    type: "radio",
    required: false,
    id: "firstRadio",
    classes: ["radioBtn"],
  });

  const br = createElement("br");

  const firstTextArea = [firstCheckBox, questionTextArea, br];

  const optionsElements = Array.from({ length: 4 }, () => {
    const checkbox = createElement("input", {
      name: "new-option",
      type: "radio",
      required: true,
      value: "",
      classes: ["radioBtn"],
    });

    const textarea = createElement("textarea", {
      classes: ["option"],
      placeholder: "What are your options?",
      onchange: (e) => {
        checkbox.value = e.target.value;
      },
    });

    const br = createElement("br");

    return [checkbox, textarea, br];
  }).flat();

  const addBtn = createElement("button", {
    text: "Add",
    classes: ["addBtn"],
    onclick: async () => {
      const newOptionTextarea = optionsElements.filter(
        (e) => e.name === "new-option"
      );
      const options = newOptionTextarea.map((e) => {
        return { question_answer: e.value, isCorrect: e.checked };
      });

      const question = questionTextArea.value;
      console.log(question, options);
      // console.log("before try catch");
      try {
        await createQuestions(question, options);
        location.reload();
      } catch (err) {
        window.alert("Error happened when creating questions: " + err.message);
      }
    },
  });

  const backBtn = createElement("button", {
    text: "Back",
    classes: ["backBtn"],
    onclick: () => history.back(),
  });

  return [heading, ...firstTextArea, ...optionsElements, addBtn, backBtn, hr];
};

const getQuestionFields = (questions) => {
  return questions.flatMap(({ id, question_text, options = [] }, index) => {
    const heading = createElement("h3", { text: `Question ${index + 1}` });

    const firstCheckBox = createElement("input", {
      type: "radio",
      required: false,
      id: "firstRadio",
      classes: ["radioBtn"],
    });

    const questionElement = createElement("textarea", {
      id: `question-${id}`,
      value: question_text,
      classes: ["question"],
    });

    const firstQuestionElement = [firstCheckBox, questionElement];

    const br = createElement("br");

    const optionsElements = options.flatMap(
      ({ id: optionID, question_answer, isCorrect }) => {
        const br = createElement("br");

        const optionElement = createElement("input", {
          id: `option-${optionID}`,
          classes: ["radioBtn"],
          value: question_answer,
          name: `question-${id}`,
          type: "radio",
          required: true,
          checked: isCorrect,
        });

        const answerEditField = createElement("textarea", {
          value: question_answer,
          required: true,
          onchange: (e) => {
            optionElement.value = e.target.value;
          },
          classes: ["option"],
        });

        return [optionElement, answerEditField, br];
      }
    );

    const updateBtn = createElement("button", {
      text: "Update",
      classes: ["updateBtn"],
      onclick: async () => {
        const newOptions = options.map(({ id: optionID }) => {
          const element = getElement(`#option-${optionID}`);
          const newIsCorrect = element.checked;
          const newAnswer = element.value;
          return {
            id: optionID,
            question_answer: newAnswer,
            isCorrect: newIsCorrect,
          };
        });
        console.log(id, questionElement.value, newOptions);
        try {
          await updateQuestions(id, questionElement.value, newOptions);
          window.alert("Your quiz is successfully updated.");
        } catch ({ message }) {
          window.alert(message);
        }
      },
    });

    return [
      heading,
      ...firstQuestionElement,
      br,
      ...optionsElements,
      updateBtn,
    ];
  });
};

window.addEventListener("load", async () => {
  const root = getElement("#main");

  const questions = await readQuestions();
  // console.log("this is the questions i'm getting" + JSON.stringify(questions));

  const questionsFields = getQuestionFields(questions);

  const newQuestionForm = makeQuestionForm();

  addElement(root, ...newQuestionForm, ...questionsFields);
});
