export default {
  data() {
    return {
      password: ""
    }
  },
  props: {
    title: String
  },
  template: `
  <div class="form-group">
    <label class="form-label" for="password">{{ title }}</label>
    <input class="form-input" type="password" v-model="password" id="password" @input="$emit('update', $event.target.value)">
  </div>
  `
}
