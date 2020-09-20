# Get All Quizzes
Example request:
`GET /api/quiz`

# Get Quizzes With Pagination
Example request:
`GET /api/quiz/search` or `GET /api/quiz/search?page=1`

# Get Quizzes With Pagination And Search Query
Example request:
`GET /api/quiz/search?page=3&search=potatoes`

# Get Specific Quiz
Example request:
`GET /api/quiz/71`

# Create Quiz
Example request:
`POST /api/quiz`

Example request body:
```sh
{
    "quiz": {
        "title": "Example title",
        "description": "Example quiz description",
        "image": "collection/ea589203-143a-4c72-bd90-018dbe511093",
        "questions": [
            {
                "text": "first",
                "answers": [
                    {
                        "text": "Q1 first answer",
                        "is_correct": false
                    },
                    {
                        "text": "Q1 second answer",
                        "is_correct": true
                    },
                    {
                        "text": "Q1 third answer",
                        "is_correct": false
                    },
                    {
                        "text": "Q1 fourth answer",
                        "is_correct": false
                    }
                ]
            },
            {
                "text": "second",
                "answers": [
                    {
                        "text": "Q2 first answer",
                        "is_correct": false
                    },
                    {
                        "text": "Q2 second answer",
                        "is_correct": false
                    },
                    {
                        "text": "Q2 third answer",
                        "is_correct": false
                    },
                    {
                        "text": "Q2 fourth answer",
                        "is_correct": true
                    }
                ]
            }
        ]
    }
}
```

Example response:
```sh
{
    "success": true,
    "id": 71
}
```

# Submit Quiz
### Request body format: answer array with all the selected answer ids in order
Example request:
`POST /api/quiz/71/submit`

Example request body:
```sh
{
    "answers": [250, 252]
}
```

Example response:
```sh
{
    "success": true,
    "quiz": # the quiz with updated times_finished and times_picked counters
}
```

# Report Question
### Format: /api/quiz/:quiz_id/report/:question_id
Example request:
`POST /api/quiz/71/report/100`

Example response:
```sh
{
    "success": true
}
```

# Delete Quiz
Example request:
`DELETE /api/quiz/71`

Example response:
```sh
{
    "success": true
}
```

# Upload Image
Example request:
`POST /api/media`

Example request body (multipart/form-data):
image=*ImageFile*

Example response:
```sh
{
    "success": true,
    "name": "collection/ea589203-143a-4c72-bd90-018dbe511093"
}
```

# Delete Image
Example request:
`DELETE /api/media`

Example request body:
```sh
{
    "name": "collection/ea589203-143a-4c72-bd90-018dbe511093",
    "deleteCachedCopies": true
}
```

Example response:
```sh
{
    "success": true
}
```