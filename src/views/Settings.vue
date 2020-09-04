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
      <b-field label="Force sync, overwrite with: ">
        <div>
          <b-button @click="forceSync('local')">Local data</b-button>
          <b-button @click="forceSync('remote')">Remote data</b-button>
        </div>
      </b-field>
    </section>
    <section class="courselist-buttons box notification is-info is-light">
      <p class="is-size-4">Choose year</p>
      <b-button :type="getButtonStyle('1')" @click="setActive('1')">1</b-button>
      <b-button :type="getButtonStyle('2')" @click="setActive('2')">2</b-button>
      <b-button :type="getButtonStyle('3')" @click="setActive('3')">3</b-button>
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
      isSyncing: SyncManager.syncing,
      CourseManager: CourseManager
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
    },
    forceSync (type) {
      switch (type) {
        case 'local':
          CourseManager.forceSyncLocal()
          break
        case 'remote':
          CourseManager.forceSyncRemote()
          break
        default:
          break
      }
    },
    getButtonStyle (year) {
      if (year === CourseManager.currentYear) {
        return 'is-info'
      } else {
        return ''
      }
    },
    setActive (newYear) {
      CourseManager.setCurrentYear(newYear)
    }
  }
}
</script>
