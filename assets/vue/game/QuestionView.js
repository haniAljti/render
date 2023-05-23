export default {
    data () {
        return {
            countDown: 30,
            answered: false
        }
    },
    created () {
        this.countDownTimer()
    },
    methods: {
        countDownTimer () {
            if (this.countDown > 0) {
                setTimeout(() => {
                    this.countDown -= 1
                    this.countDownTimer()
                }, 1000)
            }
        },
        answer (answerId) {
            io.socket.post(
                "/answer/" + answerId,
                function () {
                    
                }
            )
        }
    },
    props: ['question'],
    template: `
    <div>
        <h1>Counter: {{ countDown }}</h1>
        <h1>{{ question.title }}</h1>

        <p>{{ question.question }}</p>

        <ul 
        v-for="answer in question.answers"
        :key="answer.id"
        >
        <a @click="answer">
        <li> {{ answer.text }} </li>
        </a>
        </ul>
    </div>
    `
}
