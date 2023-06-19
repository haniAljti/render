
let noCorrectAnswerDialogShown = false

function addAnswer() {
    if ($(".quizzz-container").length < 4) {
        $("#answer-container").append(
            `
            <div class="quizzz-container">

                <div>
                    <a class="delete-answer"><i onclick="removeAnswer()" class="fa fa-solid fa-trash delete"></i></a>
                <div>
                
                <div class="form-group">
                    <label class="form-label" for="title">Antwort</label>
                    <input class="form-input" maxlength="50" type="text" id="title" name="title" style="width: 100%;">
                </div>
    
                <div class="form-group d-flex flex-row">
                    <input class="form-checkbox" type="checkbox" id="correct-answer-${$(".quizzz-container").length - 1}" name="isCorrectAnswer">
                    <label class="form-label" for="correct-answer-${$(".quizzz-container").length - 1}">Ist richtige Antwort</label>
                </div>
            </div>
            `
        )
    }
}

function removeAnswer() {
    $(".delete-answer").click(function () {
        $(this).parent().parent().remove();
    })
}


function postQuestion(quizId) {

    let isValid = validateQuiz();

    if (!isValid) {
        return;
    }

    let body = createQuestion();
    console.log(body);

    $.post(
        "/quiz/" + quizId + "/question",
        body
        )
        .done(
            function () {
                window.location.href = origin + "/quiz/" + quizId;
            }
        );
}

function updateQuestion(questionId) {

    let isValid = validateQuiz()

    if (!isValid) {
        return
    }

    let body = createQuestion()
    console.log(body)

    $.post("/question/" + questionId + "/update", body);
}

function validateQuiz() {

    let isTitleValid = $("#title").val() !== ''
    let isQuestionValid = $("#question").val() !== ''

    if (!isTitleValid) {
        showError("Titel darf nicht leer sein")
        return false
    }

    if (!isQuestionValid) {
        showError("Die Fragestellung darf nicht leer sein")
        return false
    }

    let hasCorrectAnswer = false

    if (!noCorrectAnswerDialogShown) {
        $(".quizzz-container").each(function (index) {
            if (hasCorrectAnswer) return;

            const isChecked = $(this).find('input').eq(1).is(":checked")
            if (isChecked) {
                hasCorrectAnswer = true
            }
        });
    }

    if (!hasCorrectAnswer && !noCorrectAnswerDialogShown) {
        showError('Keine Antwort ist als Korrect markiert! Wenn du sicher bist, dass du fortfahren möchtest, drücke nochmal auf den Button.')
        noCorrectAnswerDialogShown = true
        return false
    }

    let AnswerTextEmpty = false

    $(".quizzz-container").each(function (index) {
        const text = $(this).find('input').eq(0).val()
        if (text === '') {
            AnswerTextEmpty = true
        }
    })

    if (AnswerTextEmpty) {
        showError('Antwort darf nicht leer sein.')
        return false
    }

    return true
}

function showError(message) {
    $('.error-container').remove()
    $('<div class="error-container"><span>' + message + '</span></div>')
        .insertBefore(".form-button-container")
}

function createQuestion() {

    let body = {
        'question': $("#question").val(),
        'title': $("#title").val(),
        'answers': []
    }

    $(".quizzz-container").each(function (index) {
        console.log($(this).find('input').eq(0).val())
        body['answers'][index] = {
            "text": $(this).find('input').eq(0).val(),
            "isCorrect": $(this).find('input').eq(1).is(":checked")
        }
    })

    return body;
}

function sendForm(quizId) {
    let body = {
        'question': $("#question").val(),
        'title': $("#title").val(),
        'answers': []
    }

    $(".quizzz-container").each(function (index) {
        console.log($(this).find('input').eq(0).val())
        body['answers'][index] = {
            "text": $(this).find('input').eq(0).val(),
            "isCorrect": $(this).find('input').eq(1).is(":checked")
        }
    })

    console.log(body)

    $.post("/quiz/" + quizId + "/question", body);

    // $('form').trigger('submit')
}