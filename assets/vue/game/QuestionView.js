export default {
    data: function() {
        return {
            answered: false,
            countDown: this.timer,
        }
    },
    created() {
        this.countDownTimer()
    },
    methods: {
        countDownTimer() {
            if (this.countDown > 0) {
                setTimeout(() => {
                    this.countDown -= 1
                    this.countDownTimer()
                }, 1000)
            }
        },
        postAnswer(answerId) {
            let ref = this
            ref.answered = true
            io.socket.post(
                "/game/" + this.sessionid + "/answer/" + answerId,
            )
        }
    },
    props: ['question', 'timer', 'sessionid'],
    template: `
    <div class="answers-container">
        <div class="timer">Counter: {{ countDown }}</div>

        <h1>{{ question.title }}</h1>

        <p>{{ question.question }}</p>

        <h2 v-if="answered">Danke, die Scores werden angezeigt, sobald den Counter abläuft!</h2>
        
        <div class="game-container">
            <div class="answer" v-for="answer in question.answers"
            :key="answer.id" v-else>
            <a @click="postAnswer(answer.id)" class="answer-container">
            {{ answer.text }}
        </a>
            </div>
        </div>
    </div>
    `
}
