<script>
  import { mapMutations } from 'vuex'
  import { userStorageKey } from 'common/js/config'
  import { getStorageSync } from 'common/js/dom'
  export default {
    created () {
      const user = getStorageSync({
        key: userStorageKey
      })

      if (user) {
        this.SET_USERINFO(user)
      }
    },
    methods: {
      ...mapMutations([
        'SET_USERINFO'
      ])
    }
  }
</script>
