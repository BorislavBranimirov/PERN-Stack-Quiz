-- CREATE DATABASE pernstackquiz;

CREATE TABLE quizzes (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    description text,
    image text,
    times_finished int NOT NULL DEFAULT 0
);

CREATE TABLE questions (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    quiz_id int NOT NULL REFERENCES quizzes (id) ON DELETE CASCADE,
    text text NOT NULL,
    pos_num int NOT NULL,
    reports int NOT NULL DEFAULT 0
);

CREATE TABLE answers (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    question_id int NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
    text text NOT NULL,
    is_correct boolean NOT NULL DEFAULT false,
    times_picked int NOT NULL DEFAULT 0,
    pos_num int NOT NULL
);

-- example quiz data

INSERT INTO quizzes (title, description) VALUES ('Example quiz', 'Example description');

INSERT INTO questions (quiz_id, text, pos_num) VALUES (1, 'Q1', 1);
INSERT INTO answers (question_id, text, is_correct, pos_num) VALUES (1, 'Q1 A1 true', true, 1);
INSERT INTO answers (question_id, text, is_correct, pos_num) VALUES (1, 'Q1 A2', false, 2);
INSERT INTO answers (question_id, text, is_correct, pos_num) VALUES (1, 'Q1 A3', false, 3);
INSERT INTO answers (question_id, text, is_correct, pos_num) VALUES (1, 'Q1 A4', false, 4);

INSERT INTO questions (quiz_id, text, pos_num) VALUES (1, 'Q2', 2);
INSERT INTO answers (question_id, text, is_correct, pos_num) VALUES (2, 'Q2 A1', false, 1);
INSERT INTO answers (question_id, text, is_correct, pos_num) VALUES (2, 'Q2 A2', false, 2);
INSERT INTO answers (question_id, text, is_correct, pos_num) VALUES (2, 'Q2 A3 true', true, 3);
INSERT INTO answers (question_id, text, is_correct, pos_num) VALUES (2, 'Q2 A4', false, 4);