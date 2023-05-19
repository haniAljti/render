export default {
    data() {
      return {
        toggled: "false"
      }
    },
    props: ['answer'],
    template: `
    <div class="quizzz-container">
                <div>
                    <a class="delete-answer"><i onclick="removeAnswer()" class="fa fa-solid fa-trash delete"></i></a>
                </div>

                <div class="form-group">
                    <label class="form-label" for="text">Antwort</label>
                    <input class="form-input" type="text" id="text" v-model="answer.text" style="width: 100%;"">
                </div>

                <div class="form-group d-flex flex-row">
                <input
                    class="form-checkbox"
                    type="checkbox"
                    v-model="answer.isCorrect"
                    // @input="$emit('update', $event.target.checked)"
                    name="check-box"
                    checked="checked"
                    />
                    // <input class="form-checkbox" type="checkbox" id="correct-answer-1" v-model>
                    <label class="form-label" for="correct-answer-1">Ist richtige Antwort</label>
                </div>
            </div>
    `
  }