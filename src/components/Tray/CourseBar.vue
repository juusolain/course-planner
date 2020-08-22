<template>
    <div class="box" >
        <p>{{name}}</p>
        <div class="is-flex" style="flex-wrap: wrap">
            <div v-for="group in groups" :key="group.groupKey">
                <GroupButton :group="group"/>
            </div>
        </div>
    </div>
</template>

<script>
import GroupButton from './GroupButton.vue'

export default {
  props: ['groups', 'name'],
  components: { GroupButton }
}
</script>
