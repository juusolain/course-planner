<template>
  <div>
    <section class="container section box notification is-light is-primary">
      <p class="is-size-3">Sync data</p>
      <b-field label="Toggle syncing">
        <b-switch v-model="isSyncing" @input="setSyncing">{{isSyncing ? "enabled" : "disabled"}}</b-switch>
      </b-field>
      <b-field label="Sign in to enable sync">
        <b-button @click="login">Sign in with Google</b-button>
      </b-field>
    </section>
    <section class="container section box notification is-light is-danger">
      <p>Hidden courses:</p>
      <div v-for="key in hiddenKeys" :key="key">
        <b-button type="is-small" icon-right="eye" @click="unHideCourses(key)">{{key}}</b-button>
      </div>
    </section>
  </div>
</template>

<script>
import CourseManager from '@/scripts/courses'
import SyncManager from '@/scripts/sync'

export default {
  name: 'Settings',
  data () {
    return {
      hiddenKeys: CourseManager.hiddenCourseBaseKeys,
      isSyncing: false
    }
  },
  methods: {
    unHideCourses (courseBaseKey) {
      CourseManager.unHideCourses(courseBaseKey)
    },
    login () {
      this.$gapi.login()
    },
    async setSyncing (newSyncing) {
      try {
        if (newSyncing === true) {
          SyncManager.enableSync()
        } else {
          SyncManager.disableSync()
        }
      } catch (error) {
        console.log(error)
        this.isSyncing = false
      }
    }
  }
}
</script>
