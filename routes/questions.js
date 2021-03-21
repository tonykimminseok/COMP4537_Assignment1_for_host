const express = require("express");
const router = express.Router();
const client = require("../db");

// to render data from the database on a page
router.get("/", function (req, res) {
  client
    .query(
      `SELECT questions.question_id,
              questions.question_text,
              options.option_id,
              options.question_answer,
              options.is_correct
    FROM questions
    INNER JOIN options
    ON options.question_id = questions.question_id
    ORDER BY questions.question_id, options.option_id
    LIMIT 100
    `
    )
    .then(({ rows }) => {
      console.log(rows);
      res.status(200);

      const new_rows = rows
        .reduce((accumulator, curValue, curIndex) => {
          // pattern matching for curValue from rows
          const {
            question_text,
            question_answer,
            question_id: id,
            is_correct: isCorrect,
          } = curValue;

          // creating a new option object
          const option = {
            id: curValue["option_id"],
            isCorrect,
            question_answer,
          };

          if (curIndex === 0) {
            return [{ question_text, id, options: [option] }];
          } else {
            // pattern matching for accumulator
            const [head, ...tail] = accumulator;

            // pattern matching for head
            const { options, id: preId } = head;

            if (preId === id) {
              return [{ ...head, options: [...options, option] }, ...tail];
            } else {
              return [{ question_text, id, options: [option] }, ...accumulator];
            }
          }
        }, []) // [] is the initial value for reduce(), and it's initial value for accumulator
        .reverse(); // we have to reverse it because we didn't append it but prepend it

      console.log("new_rows are created: " + JSON.stringify(new_rows));

      res.json(new_rows);
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(500);
      res.json(err);
    });
});

// when a user click the create button
router.post("/", (req, res) => {
  // I can pattern match 'req.body'
  const { question_text, question_options } = req.body;

  // if question is an empty string
  if (!question_text) {
    res.status(400);
    res.json({ error: "Question text cannot be empty string." });
    return;
  }

  // if there aren't any option choices
  if (!question_options) {
    res.status(400);
    res.json({ error: "Question option needs to have at least 1 choice." });
    return;
  }

  // if there aren't any correct answers
  if (!question_options.some(({ isCorrect }) => isCorrect)) {
    res.status(400);
    res.json({ error: "Question option must have at least 1 answer." });
    return;
  }

  // if there is less than two option choices
  // question_options is an array
  if (question_options.length < 2) {
    res.status(400);
    res.json({ error: "There must be at least 2 option choices" });
  }

  client
    .query({
      text: `INSERT INTO questions(question_text)
       VALUES ($1::text)
       RETURNING question_id`,
      values: [question_text],
    })
    .then(({ rows }) => {
      const [{ question_id: questionID }] = rows;

      const optionsChoice = question_options
        .map(
          ({ question_answer, isCorrect }) =>
            `(${questionID}, '${question_answer}', ${isCorrect})`
        )
        .join(", ");

      client
        .query(
          `INSERT INTO options(question_id, question_answer, is_correct)
           VALUES ${optionsChoice}
           RETURNING option_id`
        )
        .then(({ rows }) => {
          res.status(200);
          res.json({
            id: questionID,
            options: rows.map(({ option_id: optID }) => optID),
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500);
        });
    })
    .catch((err) => {
      console.error(err);
    });
});

// when a user wants to update, in this case, when a save button is clicked
router.put("/", (req, res) => {
  const { id, question_text, question_options } = req.body;

  if (id == null) {
    res.status(400);
    res.json({ error: "Missing question id" });
    return;
  }

  if (!question_text) {
    res.status(400);
    res.json({ error: "Question can't be empty" });
    return;
  }

  if (!question_options) {
    res.status(400);
    res.json({ error: "There must be at least 1 option" });
    return;
  }

  if (!question_options.some(({ isCorrect }) => isCorrect)) {
    res.status(400);
    res.json({ error: "There must be 1 correct option" });
    return;
  }

  if (
    !question_options.every(({ question_answer }) => question_answer !== "")
  ) {
    res.status(400);
    res.json({ error: "Answers cannot be empty" });
    return;
  }

  if (question_options.length < 2) {
    res.status(400);
    res.json({ error: "There must be at least 2 options" });
    return;
  }

  client
    .query(
      `UPDATE questions
       SET question_text = $1::text
       WHERE question_id = $2`,
      [question_text, id]
    )
    .then(() => {
      const questionID = id;
      const optionsChoice = question_options
        .map(({ id, question_answer, isCorrect }) => {
          return `(${id}, ${questionID}, '${question_answer}', ${isCorrect})`;
        })
        .join(", ");

      // console.log(optionsValues);

      client
        .query(
          `INSERT INTO options (option_id, question_id, question_answer, is_correct)
         VALUES ${optionsChoice}
         ON CONFLICT (option_id) DO UPDATE
         SET question_id = excluded.question_id,
             question_answer = excluded.question_answer,
             is_correct = excluded.is_correct`
        )
        .then((result) => {
          res.status(200);
          res.json(result);
        })
        .catch((err) => {
          console.error(err);
          res.status(500);
          res.json(err);
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json(err);
    });
});

module.exports = router;
