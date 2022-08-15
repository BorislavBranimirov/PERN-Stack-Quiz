-- CREATE DATABASE pernstackquiz;

DROP TABLE IF EXISTS answers;

DROP TABLE IF EXISTS questions;

DROP TABLE IF EXISTS quizzes;

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

-- example quiz
INSERT INTO quizzes (title, description, image, times_finished) VALUES ('Example quiz', 'Example description', NULL, 2);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (1, 'Q1', 1, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (1, 'Q1 A1 true', true, 1, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (1, 'Q1 A2', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (1, 'Q1 A3', false, 0, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (1, 'Q1 A4', false, 0, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (1, 'Q2', 2, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (2, 'Q2 A1', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (2, 'Q2 A2', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (2, 'Q2 A3 true', true, 1, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (2, 'Q2 A4', false, 0, 4);

-- raccoon quiz
INSERT INTO quizzes (title, description, image, times_finished) VALUES ('Raccoon facts', 'Test your knowledge of this cute and intelligent animal.', 'quiz-images/f7638cae-2611-4d42-a389-1503451c783c', 32);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (2, 'What is the common raccoon''s scientific name?', 1, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (3, 'Ailurus fulgens', false, 3, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (3, 'Procyon lotor', true, 15, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (3, 'Ursus arctos', false, 12, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (3, 'Ailuropoda melanoleuca', false, 2, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (2, 'The common raccoon is native to which continent?', 2, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (4, 'North America', true, 26, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (4, 'Asia', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (4, 'Europe', false, 5, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (4, 'Africa', false, 0, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (2, 'How many young are there usually in a raccoon''s litter?', 3, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (5, 'One to two', false, 17, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (5, 'Two to five', true, 13, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (5, 'Five to ten', false, 1, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (5, 'Ten to fifteen', false, 1, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (2, 'Which city has the highest population of raccoons?', 4, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (6, 'Berlin', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (6, 'London', false, 0, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (6, 'Toronto', true, 30, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (6, 'Tokyo', false, 2, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (2, 'What is the most distinctive feature of the raccoon?', 5, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (7, 'Colourful tail', false, 2, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (7, 'Elongated beak', false, 0, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (7, 'Black fur around the eyes that looks like a mask', true, 30, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (7, 'Blue feet', false, 0, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (2, 'The raccoon is known as "washing bear" in some languages for what reason?', 6, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (8, 'Frequently washing its tail', false, 5, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (8, 'Washing its shelter', false, 3, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (8, 'Semi-aquatic lifestyle', false, 0, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (8, 'Appearing to wash its food', true, 24, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (2, 'What is unusual about the raccoon''s tail?', 7, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (9, 'Yellow stripes', false, 1, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (9, 'Short length', false, 4, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (9, 'White dots', false, 0, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (9, 'Black rings', true, 27, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (2, 'The raccoon was originally placed in which genus?', 8, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (10, 'Ailuropoda', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (10, 'Ursus', true, 16, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (10, 'Vulpes', false, 14, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (10, 'Nyctereutes', false, 2, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (2, 'One way raccoons escape threats they cannot outrun is what?', 9, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (11, 'Burrowing underground', false, 8, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (11, 'Releasing a toxic odor', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (11, 'Climbing a tree', true, 16, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (11, 'Disorienting the threat with a high-pitch scream', false, 7, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (2, 'What is special about the raccoon''s forefeet?', 10, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (12, 'Long claws for self-defense', false, 8, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (12, 'Dexterous toes for grasping objects', true, 19, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (12, 'They are significantly larger than their hindfeet', false, 1, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (12, 'They are specialised for digging burrows', false, 4, 4);

-- computers quiz
INSERT INTO quizzes (title, description, image, times_finished) VALUES ('Computer Trivia', NULL, 'quiz-images/7798d427-206d-49f4-a55d-94db6ff13d7f', 18);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (3, 'When did the first version of Microsoft Windows launch?', 1, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (13, '1980', false, 4, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (13, '1985', true, 4, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (13, '1990', false, 2, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (13, '1995', false, 8, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (3, 'Which was the first computer to use a mouse?', 2, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (14, 'Apple Lisa', false, 11, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (14, 'Commodore 64', false, 3, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (14, 'Xerox Alto', true, 2, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (14, 'IBM PC', false, 2, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (3, 'When was the first gigabyte disk drive released?', 3, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (15, '1980', true, 6, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (15, '1975', false, 2, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (15, '1984', false, 7, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (15, '1991', false, 3, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (3, 'What was the first IBM computer model called?', 4, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (16, 'IBM 5150', true, 10, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (16, 'IBM XT 286', false, 3, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (16, 'IBM PCjr', false, 0, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (16, 'IBM 3270 AT', false, 5, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (3, 'Which of the following was the first commercial microprocessor?', 5, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (17, 'Harris HM-6100', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (17, 'TMS 1802NC', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (17, 'Motorola 6809', false, 2, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (17, 'Intel 4004', true, 15, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (3, 'Who created the Linux kernal?', 6, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (18, 'Bill Gates', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (18, 'Linus Torvalds', true, 16, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (18, 'Dennis Ritchie', false, 2, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (18, 'Ken Thompson', false, 0, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (3, 'Ethernet was developed by which company?', 7, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (19, 'IBM', false, 3, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (19, 'Xerox', true, 2, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (19, 'AT&T', false, 11, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (19, 'Packard Bell', false, 2, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (3, 'What was the first computer to be marketed as a ''laptop''?',  8, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (20, 'Sharp PC-5000', false, 3, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (20, 'IBM ThinkPad 700', false, 7, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (20, 'Gavilan SC', true, 7, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (20, 'Dulmont Magnum', false, 1, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (3, 'Which company invented the hard disk drive?', 9, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (21, 'Hitachi', false, 1, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (21, 'Compaq', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (21, 'Dell', false, 4, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (21, 'IBM', true, 12, 4);

-- video games quiz
INSERT INTO quizzes (title, description, image, times_finished) VALUES ('Video Games', 'Video Game Trivia for Gaming Enthusiasts', 'quiz-images/3e6b6ad9-6ca8-4c10-828d-44f1ab110444', 10);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'When was the first Pokemon game released?', 1, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (22, '1994', false, 3, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (22, '1999', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (22, '1996', true, 5, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (22, '1989', false, 1, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'The character ''Geralt of Rivia'' stars in which of the following game franchises?', 2, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (23, 'Mario', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (23, 'Pokemon', false, 0, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (23, 'The Witcher', true, 9, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (23, 'Halo', false, 1, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'Which of the following games was awarded ''Game of the Year'' at The Game Awards 2018?', 3, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (24, 'Dark Souls II', false, 4, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (24, 'Doom', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (24, 'Hades', false, 1, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (24, 'God of War', true, 4, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'Which of the following games includes a multiplayer mode?', 4, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (25, 'Marvel''s Spider-Man', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (25, 'Titanfall 2', true, 10, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (25, 'Hitman 3', false, 0, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (25, 'Horizon Zero Dawn', false, 0, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'Fallout: New Vegas was developed by which game studio?', 5, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (26, 'Obsidian Entertainment', true, 3, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (26, 'Bethesda Game Studios', false, 5, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (26, 'Insomniac Games', false, 0, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (26, 'Rocksteady Studios', false, 2, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'Which video game console has the most sales as of 2022?', 6, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (27, 'PlayStation Portable', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (27, 'PlayStation 2', true, 6, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (27, 'Nintendo DS', false, 3, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (27, 'Xbox 360', false, 1, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'In which game was Nintendo''s Mario''s first appearance?', 7, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (28, 'Super Mario Bros', false, 7, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (28, 'Wrecking Crew ''98', false, 0, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (28, 'Donkey Kong', true, 1, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (28, 'Mario Kart 64', false, 2, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'How many copies did The Elder Scrolls V: Skyrim sell in the first five years since its original release?', 8, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (29, '30 million', true, 3, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (29, '10 million', false, 4, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (29, '6 million', false, 3, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (29, '70 million', false, 0, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'The video game franchise Resident Evil is known as what in Japan?', 9, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (30, 'The Evil Within', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (30, 'Biohazard', true, 4, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (30, 'Dead Rising', false, 3, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (30, 'Kuon', false, 3, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'The term AAA (pronounced Triple-A) refers to what?', 10, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (31, 'A part of a video game controller', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (31, 'Video games produced by medium to large size game studios', true, 9, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (31, 'A fictional language from The Legend of Zelda franchise', false, 0, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (31, 'A video game genre', false, 1, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (4, 'Who is the creator of Pac-Man?', 11, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (32, 'Toru Iwatani', true, 4, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (32, 'Allan Alcorn', false, 2, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (32, 'Yuji Naka', false, 1, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (32, 'Alexey Pajitnov', false, 3, 4);

-- random trivia quiz
INSERT INTO quizzes (title, description, image, times_finished) VALUES ('Random trivia', NULL, NULL, 5);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (5, 'Which monarch was known as ''the wisest fool in Christendom''?', 1, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (33, 'James I', true, 3, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (33, 'Charles I', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (33, 'Edward I', false, 1, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (33, 'Henry I', false, 0, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (5, 'Oberon is a satellite of which planet?', 2, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (34, 'Mercury', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (34, 'Neptune', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (34, 'Uranus', true, 4, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (34, 'Mars', false, 0, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (5, 'Tomas Masaryk was the first president of which country?', 3, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (35, 'Czechoslovakia', true, 2, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (35, 'Poland', false, 2, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (35, 'Hungary', false, 0, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (35, 'Yugoslavia', false, 1, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (5, 'If you planted the seeds of ''Quercus robur'', what would grow?', 4, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (36, 'Trees', true, 2, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (36, 'Flowers', false, 2, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (36, 'Vegetables', false, 1, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (36, 'Grain', false, 0, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (5, 'Which scientific unit is named after an Italian nobleman?', 5, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (37, 'Pascal', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (37, 'Ohm', false, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (37, 'Volt', true, 3, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (37, 'Hertz', false, 1, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (5, 'What was the profession of the composer Borodin?', 6, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (38, 'Naval captain', false, 2, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (38, 'Chemist', true, 1, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (38, 'Lawyer', false, 1, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (38, 'Chef', false, 1, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (5, 'Which of these is a butterfly, not a moth?', 7, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (39, 'Mother Shipton', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (39, 'Red Underwing', false, 3, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (39, 'Burnished Brass', false, 1, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (39, 'Speckled Wood', true, 1, 4);

INSERT INTO questions (quiz_id, text, pos_num, reports) VALUES (5, 'Who was the first man to travel into space twice?', 8, 0);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (40, 'Vladimir Titov', false, 0, 1);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (40, 'Michael Collins', false, 0, 2);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (40, 'Gus Grissom', true, 5, 3);
INSERT INTO answers (question_id, text, is_correct, times_picked, pos_num) VALUES (40, 'Yuri Gagarin', false, 0, 4);