<template>
  <div class="courselist">
    <h1>This is the courses page</h1>
    <CourseList />
  </div>
</template>

<script>
import CourseList from "@/components/CourseList.vue";
export default {
  components: {
    CourseList
  }
};
</script>
