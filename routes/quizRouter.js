const express = require('express');
const db = require('../config/db');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    // get all quizzes
    try {
      const { rows } = await db.query('SELECT * FROM quizzes');
      return res.json(rows);
    } catch (err) {
      return res
        .status(500)
        .json({ err: 'An error occurred while searching for quizzes' });
    }
  })
  .post(async (req, res) => {
    // create a new quiz
    /*
        expected input:
        quiz: {
            title,
            description(optional),
            image(optional),
            questions: [{
                text,
                answers: [{ text, is_correct }...]
            }...]
        }
        */
    const { title, description, image, questions } = req.body.quiz;

    if (!title || typeof title !== 'string') {
      return res.status(422).json({ err: 'No quiz title provided' });
    }

    if (title.length > 150) {
      return res
        .status(422)
        .json({ err: 'Quiz title length is limited to 150 characters' });
    }

    if (description) {
      if (typeof description !== 'string') {
        return res
          .status(422)
          .json({ err: 'Quiz description must be a string' });
      } else {
        if (description.length > 200) {
          return res
            .status(422)
            .json({
              err: 'Quiz description length is limited to 200 characters',
            });
        }
      }
    }

    if (image) {
      try {
        // check if image exists
        await cloudinary.uploader.explicit(image, { type: 'upload' });
      } catch (err) {
        if (err.http_code === 404) {
          return res.status(404).json({ err: 'Image not found' });
        } else {
          return res
            .status(500)
            .json({ err: 'An error occurred while searching for the image' });
        }
      }
    }

    if (!(questions instanceof Array) || questions.length === 0) {
      return res.status(422).json({ err: 'No questions provided' });
    }

    // validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text || typeof questions[i].text !== 'string') {
        return res
          .status(422)
          .json({ err: `Question ${i + 1} has no text body provided` });
      }

      // validate answers
      let correctCounter = 0;
      for (let j = 0; j < questions[i].answers.length; j++) {
        const answer = questions[i].answers[j];
        if (!answer.text || typeof answer.text !== 'string') {
          return res.status(422).json({
            err: `Question ${i + 1}, answer ${j + 1} has no text body provided`,
          });
        }

        if (typeof answer.is_correct !== 'boolean') {
          return res.status(422).json({
            err: `Question ${i + 1}, answer ${
              j + 1
            } has no correct status provided`,
          });
        }

        if (answer.is_correct) {
          correctCounter++;
        }
      }
      if (correctCounter !== 1) {
        return res.status(422).json({
          err: `All questions must have one and only one correct answer, please fix question ${
            i + 1
          }`,
        });
      }
    }

    // begin transaction
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // insert the quiz into db
      const quiz = (
        await client.query(
          'INSERT INTO quizzes (title, description, image) VALUES ($1, $2, $3) RETURNING *',
          [title, description || null, image || null]
        )
      ).rows[0];

      // insert the questions into db
      const qs = questions;
      for (let i = 0; i < qs.length; i++) {
        const questionRow = (
          await client.query(
            'INSERT INTO questions (quiz_id, text, pos_num) VALUES ($1, $2, $3) RETURNING *',
            [quiz.id, qs[i].text, i + 1]
          )
        ).rows[0];

        // construct the values for the text in answers query
        let answersValuesText = [];
        let answersValues = [];
        let counter = 1;
        for (let j = 0; j < qs[i].answers.length; j++) {
          answersValuesText.push(
            `($${counter}, $${counter + 1}, $${counter + 2}, $${counter + 3})`
          );
          answersValues.push(
            qs[i].answers[j].text,
            qs[i].answers[j].is_correct,
            j + 1,
            questionRow.id
          );
          counter += 4;
        }

        // insert the answers into db
        const answerRows = (
          await client.query(
            `INSERT INTO answers (text, is_correct, pos_num, question_id) \
                    VALUES ${answersValuesText.join(', ')} RETURNING *`,
            answersValues
          )
        ).rows;
      }

      await client.query('COMMIT');
      client.release();
      return res.json({ success: true, id: quiz.id });
    } catch (err) {
      await client.query('ROLLBACK');
      client.release();
      return res
        .status(500)
        .json({ err: 'An error occurred while creating quiz' });
    }
  });

router.route('/search').get(async (req, res) => {
  // search for quizzes

  const searchPattern = req.query.search ? `%${req.query.search}%` : `%`;
  // page numbering starts at 1
  const page = parseInt(req.query.page, 10) || 1;
  // limit the number of rows returned for pagination, and offset appropriately
  const limitCount = 12;
  // track if there are more records after the current page
  let isLastPage = false;

  try {
    const queryText =
      'SELECT * ' +
      'FROM quizzes ' +
      'WHERE title ILIKE $1 ' +
      'ORDER BY times_finished DESC, title ASC ' +
      'LIMIT $2 OFFSET $3';

    // make limit = actual limit + 1 to check if there are any records after the current page
    // more efficient than using count(*) to check count of all records
    const queryValues = [
      searchPattern,
      limitCount + 1,
      (page - 1) * limitCount,
    ];

    let { rows } = await db.query(queryText, queryValues);
    // an extra record is only used for the last page check and isn't returned with the rest
    // if no extra record was found, set the last page flag to true
    if (rows.length > limitCount) {
      rows.pop();
    } else {
      isLastPage = true;
    }

    return res.json({ quizzes: rows, isLastPage });
  } catch (err) {
    return res
      .status(500)
      .json({ err: 'An error occurred while searching for quizzes' });
  }
});

router
  .route('/:id')
  .get(async (req, res) => {
    // get a specific quiz
    try {
      const quiz = (
        await db.query('SELECT * FROM quizzes WHERE id = $1', [req.params.id])
      ).rows[0];

      if (!quiz) {
        return res.status(404).json({ err: 'Quiz not found' });
      }

      quiz.questions = (
        await db.query(
          'SELECT id, text, pos_num, reports FROM questions WHERE quiz_id = $1 ORDER BY pos_num ASC',
          [quiz.id]
        )
      ).rows;

      for (let i = 0; i < quiz.questions.length; i++) {
        quiz.questions[i].answers = (
          await db.query(
            'SELECT id, text, times_picked, pos_num FROM answers ' +
              'WHERE question_id = $1 ' +
              'ORDER BY pos_num ASC',
            [quiz.questions[i].id]
          )
        ).rows;
      }

      return res.json(quiz);
    } catch (err) {
      return res
        .status(500)
        .json({ err: 'An error occurred while searching for quiz' });
    }
  })
  .delete(async (req, res) => {
    // delete a specific quiz
    try {
      const quiz = (
        await db.query('SELECT id, image FROM quizzes WHERE id = $1', [
          req.params.id,
        ])
      ).rows[0];

      if (!quiz) {
        return res.status(404).json({ err: 'Quiz not found' });
      }

      if (quiz.image) {
        let imageExists = true;
        try {
          // check if image exists
          await cloudinary.uploader.explicit(quiz.image, { type: 'upload' });
        } catch (err) {
          // if image is not found, there is no need to delete it, so continue with deleting the quiz
          if (err.http_code !== 404) {
            throw err;
          } else {
            imageExists = false;
          }
        }

        if (imageExists) {
          const imageIsUsedByOtherQuizzes =
            (
              await db.query(
                'SELECT id, title FROM quizzes WHERE image = $1 AND NOT id = $2 LIMIT 1',
                [quiz.image, req.params.id]
              )
            ).rows.length > 0;

          // don't delete the image if other quizzes use it
          // only the last quiz to have it should trigger a delete
          if (!imageIsUsedByOtherQuizzes) {
            const imgDeleteRes = await cloudinary.uploader.destroy(quiz.image);

            // if there was an error while deleting the image, don't delete the quiz
            if (imgDeleteRes.result !== 'ok') {
              return res
                .status(500)
                .json({ err: 'Failed to delete quiz image' });
            }
          }
        }
      }

      const deletedQuiz = (
        await db.query('DELETE FROM quizzes WHERE id = $1 RETURNING *', [
          req.params.id,
        ])
      ).rows[0];

      return res.json({ success: true });
    } catch (err) {
      return res
        .status(500)
        .json({ err: 'An error occurred while deleting quiz' });
    }
  });

router.route('/:id/report/:questionId').post(async (req, res) => {
  // increments report count of a quiz question
  try {
    const updatedQuestion = (
      await db.query(
        'UPDATE questions ' +
          'SET reports = reports + 1 ' +
          'WHERE quiz_id = $1 AND id = $2 ' +
          'RETURNING *',
        [req.params.id, req.params.questionId]
      )
    ).rows[0];

    if (!updatedQuestion) {
      return res.status(404).json({ err: 'Question not found' });
    }

    return res.json({ success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ err: 'An error occurred while reporting quiz question' });
  }
});

router.route('/:id/submit').post(async (req, res) => {
  // submit answers for a specific quiz
  const userAnswers = req.body.answers;

  if (!(userAnswers instanceof Array) || userAnswers.length === 0) {
    return res.status(422).json({ err: 'No answers provided' });
  }

  // begin transaction
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // increment the quiz finished counter
    const quiz = (
      await client.query(
        'UPDATE quizzes SET times_finished = times_finished + 1 WHERE id = $1 RETURNING *',
        [req.params.id]
      )
    ).rows[0];

    quiz.questions = (
      await client.query(
        'SELECT id, text, pos_num FROM questions WHERE quiz_id = $1 ORDER BY pos_num ASC',
        [req.params.id]
      )
    ).rows;

    if (quiz.questions.length !== userAnswers.length) {
      await client.query('ROLLBACK');
      client.release();
      return res
        .status(422)
        .json({ err: 'Incorrect number of answers provided' });
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      quiz.questions[i].answers = (
        await client.query(
          'SELECT * FROM answers WHERE question_id = $1 ORDER BY pos_num ASC',
          [quiz.questions[i].id]
        )
      ).rows;

      // create array of all answer ids to compare to the ids the user provided
      const answerIds = quiz.questions[i].answers.map((ans) => ans.id);

      // save index of user's answer in answersIds
      // to find if it exists and to know which array element to update before returning the data
      const userAnswerIndex = answerIds.indexOf(userAnswers[i]);

      // check if the id user provided is valid answer id for the question
      if (userAnswerIndex === -1) {
        await client.query('ROLLBACK');
        client.release();
        return res
          .status(422)
          .json({ err: `Incorrect answer id provided for question ${i + 1}` });
      }

      // increment the answer picked counter
      quiz.questions[i].answers[userAnswerIndex] = (
        await client.query(
          'UPDATE answers ' +
            'SET times_picked = times_picked + 1 ' +
            'WHERE question_id = $1 AND id = $2 ' +
            'RETURNING *',
          [quiz.questions[i].id, userAnswers[i]]
        )
      ).rows[0];
    }

    await client.query('COMMIT');
    client.release();
    return res.json({
      success: true,
      quiz: quiz,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    client.release();
    return res
      .status(500)
      .json({ err: 'An error occurred while submitting quiz' });
  }
});

module.exports = router;
