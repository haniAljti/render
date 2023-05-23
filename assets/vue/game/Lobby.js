export default {
    props: ['status', 'participants', 'startedBy'],
    template: `
    <div>
        Juchei!

        <p>Game Status: {{ status }}</p>
        <p>Started By: {{ startedBy }}</p>
        <div>
            <form action="/quiz/start" method="post">
                <button class="btn btn-secondary secondary-button">RUUUUN</button>
            </form>
            <form action="/quiz/" method="post">
                <button class="btn btn-secondary secondary-button">RUUUUN</button>
            </form>
        </div>

        <li v-for="participant in participants">
        <p>
        {{ participant.name }}
        </p>
        </li>

    </div>
    `
  }
  