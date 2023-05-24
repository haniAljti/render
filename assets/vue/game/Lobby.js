export default {
    props: ['status', 'participants', 'startedBy'],
    template: `
    <div>

        <p>Game Status: {{ status }}</p>
        <table v-if="participants" class="table table-hover table-dark leaderboard">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="participant in participants">
                    <td>{{ participant.participant }}</td>
                    <td>{{ participant.score }}</td>
                </tr>
            </tbody>
        </table>

    </div>
    `
  }
  