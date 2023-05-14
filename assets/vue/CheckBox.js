export default {
  data() {
    return {
      toggled: "false"
    }
  },
  props: {
    title: String
  },
  template: `
  <div class="form-group d-flex flex-row align-items-center">
    <input
        class="form-checkbox"
        type="checkbox"
        v-model="toggled"
        @input="$emit('update', $event.target.checked)"
        name="check-box"
        checked="checked"
        />

    <label class="form-label" for="check-box">{{title}}</label>
  </div>
  `
}
