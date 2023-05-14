export default {
  data() {
    return {
      text: ""
    }
  },
  props: {
    title: String
  },
  template: `
  <div class="form-group">
    <label class="form-label">{{ title }}</label>
    <input class="form-input" type="date" v-model="text" @input="$emit('update', $event.target.value)">
  </div>
  `
}
