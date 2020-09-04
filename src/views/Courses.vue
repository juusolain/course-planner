<template>
  <section class="courselist container section">
    <div class="courselist-buttons box notification is-primary is-light">
      <b-button :type="getButtonStyle('0')" @click="setActive('0')">S</b-button>
      <b-button :type="getButtonStyle('1')" @click="setActive('1')">1</b-button>
      <b-button :type="getButtonStyle('2')" @click="setActive('2')">2</b-button>
      <b-button :type="getButtonStyle('3')" @click="setActive('3')">3</b-button>
    </div>
    <div class="box is-light is-info notification">
      <CourseList :activeYear="activeYear" />
    </div>
  </section>
</template>

<script>
import CourseList from '@/components/CourseList.vue'

export default {
  components: {
    CourseList
  },
  data () {
    return {
      activeYear: '1'
    }
  },
  methods: {
    getButtonStyle (year) {
      if (year === this.activeYear) {
        return 'is-primary'
      } else {
        return ''
      }
    },
    setActive (year) {
      this.activeYear = year
    }
  }
}
</script>

<style lang="scss" scoped>
  button{
    margin: 0.1em
  }
</style>
