<template>
  <div class="container">
    <div class="columns box notification">
      <div class="column is-narrow is-flex basecoursediv">
        <p class="is-size-5 coursetext">{{courseBaseKey}}</p>
        <b-button type="is-primary is-light" size="is-small" class="coursebutton" @click="hideCourses(courseName)" icon-right="eye-off"></b-button>
      </div>
      <div class="column">
        <div class="is-flex courselist">
          <div v-for="course of courseArray" :key="course.courseKey">
            <b-button size="is-small" :type="calcType(course)" @click="toggleWanted(course.courseKey)">{{course.courseNumber}}{{course.selectionYear}}</b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseBar',
  props: ['courseArray'],
  methods: {
    toggleWanted (courseKey) {
      console.log(`Toggle wanted ${courseKey}`)
    },
    getType (course) {
      return 'is-light'
    }
  }
}

</script>

<style lang="scss" scoped>
.courselist{
  flex-wrap: wrap;
}
.coursetext{
  margin: 1em;
}
.columns{
  margin: 1em;
}
.coursebutton{
  margin: auto 0.5em;
}
.basecoursediv{
  justify-content: space-evenly;
}
</style>
