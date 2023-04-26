
var index = 2

function addAnswer() {
    if ($(".quizzz-container").length < 4) {
        $("#answer-container").append(
            `
            <div class="quizzz-container">
                <div class="form-group">
                    <label class="form-label" for="title">Antwort</label>
                    <input class="form-input" type="text" id="title" name="title" style="width: 100%;">
                </div>
    
                <div class="form-group d-flex flex-row">
                    <input class="form-checkbox" type="checkbox" id="correct-answer-${index}" name="isCorrectAnswer">
                    <label class="form-label" for="correct-answer-${index}">Ist rechtige Antwort</label>
                </div>
            </div>
            `
        )
        index++
        
    }    
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