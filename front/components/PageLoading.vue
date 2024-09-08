<template>
  <div v-show="isShow" ref="page_loading" class="spinner-border text-warning" style="z-index:98; display:none; position:absolute;" />
</template>

<script>

export default {
  name: 'PageLoading',
  props: {
    isShow: Boolean
  },
  mounted () {
    this.adjustLoadingPosition()
    window.addEventListener('resize', this.adjustLoadingPosition)
  },
  methods: {
    adjustLoadingPosition () {
      const loading = this.$refs.page_loading

      const winWidth = window.innerWidth
      const winHeight = window.innerHeight
      const centerWidth = loading.offsetWidth
      const centerHeight = loading.offsetHeight

      loading.style.left = (winWidth / 2) - centerWidth + 9 + 'px'
      loading.style.top = (winHeight / 2) - centerHeight + 9 + 'px'
    }
  }
}
</script>
