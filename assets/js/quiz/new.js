
function addAnswer() {
    $(this).closest("div").append(
        `
        <div class="quizzz-container">
                    <div class="form-group">
                        <label class="form-label" for="title">Antwort</label>
                        <input class="form-input" type="text" id="title" name="title">
                    </div>

                    <div class="form-group d-flex row">
                        <label class="form-label" for="correct-answer">Ist rechtige Antwort</label>
                        <input class="form-input" type="checkbox" id="correct-answer" name="isCorrectAnswer">
                    </div>
                </div>
        `
    )
}

function addQuestion() {
    $("#questions-container").append(
        `
        <div class="form-group">
          <label class="form-label" for="title">Titel</label>
          <input class="form-input" type="text" id="title" name="title">
        </div>

        <div class="form-group">
          <label class="form-label" for="question">Fragestellung</label>
          <input class="form-input" type="text" id="question" name="question">
        </div>
        `
    )
}

