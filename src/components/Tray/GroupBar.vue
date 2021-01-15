<template>
    <div class="box" >
        <p>{{name}}</p>
        <div class="is-flex" style="flex-wrap: wrap">
            <GroupButton v-for="group in groups" :key="group.groupKey" :activeYear="activeYear" :group="group"/>
        </div>
    </div>
</template>

<script>
import GroupButton from './GroupButton.vue'

export default {
  props: ['groups', 'name', 'activeYear'],
  components: { GroupButton }
}
</script>
