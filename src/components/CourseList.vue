<template>
  <div>
    <b-table :data="data" :columns="columns"> </b-table>
  </div>
</template>

<script>
import store from "@/store.js";

export default {
  name: "CourseList",
  data() {
    return {
      data: store.courseList,
      columns: [{ field: "name", label: "name" }]
    };
  }
};
</script>
