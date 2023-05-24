export default {
    props: ['status', 'participants', 'startedBy'],
    template: `
    <div>

        <p>Game Status: {{ status }}</p>

        <li v-for="participant in participants" class="quiz_container">
        <p>
        {{ participant.participant }} Score: {{ participant.score }}
        </p>
        </li>

    </div>
    `
  }
  