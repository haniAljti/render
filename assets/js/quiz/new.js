
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
    $(".delete-answer").click(function() {
        $(this).parent().parent().remove();
    }
    )
}


function postQuestion(quizId) {

    let body = createQuestion()

    console.log(body)

    $.post("/quiz/" + quizId + "/question", body);
}

function updateQuestion(questionId) {

    let body = createQuestion()

    console.log(body)

    $.post("/question/" + questionId + "/update", body);
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