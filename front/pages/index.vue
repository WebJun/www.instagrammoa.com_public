<template>
  <div>
    <PageLoading :is-show="isShowPageLoading.value" />
    <div class="flex-container" style="color:#fff;">
      <div class="container top-section" style="">
        <router-link :to="{ name: 'index' }">
          INSTAMOA
        </router-link>
      </div>
      <div class="bottom-section">
        <div class="wrap">
          <h1>
            <router-link :to="{ name: 'index' }" class="logo-link">
              인스타모아
            </router-link>
          </h1>
          <h6>이제, 인스타그램 이미지를 편하게 보세요.</h6>
          <div class="testDiv">
            <input v-model="keyword" type="text" placeholder="인스타그램 주소 입력" class="testInput" @keydown.enter="search">
            <button type="button" class="testBtn" @click="search">
              검색
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="image-container">
      <div v-for="(area, index) in areas" :key="index" class="image-area">
        <div :ref="`imageWrapper_${index}`" class="image-wrapper">
          <!-- <img
            v-for="(file, index2) in area" :key="index2"
            :src="createProxyUrl(file.imageUrl)"
          > -->
        </div>
        <div :ref="`loadingIcon_${index}`" class="loading-icon" />
        <div :ref="`lastChecker_${index}`" class="last-checker" />
      </div>
    </div>
  </div>
</template>

<script>
class Toast {
  $bvToast = null

  setBvToast = ($bvToast) => {
    this.$bvToast = $bvToast
  }

  send = (msg) => {
    this.$bvToast.toast(msg, {
      title: '알림',
      autoHideDelay: 5000,
      appendToast: false
    })
  }
}

class ImageApi {
  apiUrl = process.env.ENV === 'prd'
    ? 'https://api.instagrammoa.com'
    : 'https://devapi.instagrammoa.com'

  $axios = null
  $bvToast = null
  mode = null
  seq = null
  isShowPageLoading = {
    value: false
  }

  setAxios = ($axios) => {
    this.$axios = $axios
  }

  setIsShowPageLoading = (isShowPageLoading) => {
    this.isShowPageLoading = isShowPageLoading
  }

  setToast = (toast) => {
    this.toast = toast
  }

  setMode = (mode) => {
    this.mode = mode
  }

  setSeq = (seq) => {
    this.seq = seq
  }

  search = async (keyword) => {
    let response
    try {
      const data = {
        keyword
      }
      this.isShowPageLoading.value = true
      response = await this.$axios.post(`${this.apiUrl}/api/search`, data, { timeout: 60 * 1000 })
      this.isShowPageLoading.value = false
    } catch (error) {
      this.isShowPageLoading.value = false
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error(error.message)
        this.toast.send('요청이 타임아웃되었습니다')
      } else {
        console.error(error.message)
        this.toast.send('다른 종류의 에러가 발생했습니다')
      }
    }
    return response.data
  }

  fetchFiles = async (page) => {
    let response
    try {
      const data = {
        mode: this.mode,
        seq: this.seq,
        page
      }
      response = await this.$axios.post(`${this.apiUrl}/api/files`, data, { timeout: 10 * 1000 })
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        this.toast.send('요청이 타임아웃되었습니다')
        console.error(error.message)
      } else {
        this.toast.send('다른 종류의 에러가 발생했습니다')
        console.error(error.message)
      }
    }
    return response.data
  }
}

export default {
  name: 'CustomRouteName',
  layout: 'NoHeader',
  data: () => ({
    imageApi: null,
    // keyword: 'https://www.instagram.com/dlwlrma/',
    keyword: '',
    nowfiles: [], // 지금가져온애 // 다모은애 //뿌린애 나누면좋을듯
    areas: [],
    isProcessing: false,
    page: 1,
    xboxImageUrl: 'https://cdn4.instagrammoa.com/xbox.png',
    columnNumber: 3,
    isShowPageLoading: {
      value: false
    },
    toast: new Toast(),
    lastPage: false
  }),
  mounted () {
    this.imageApi = new ImageApi()
    this.imageApi.setAxios(this.$axios)
    this.imageApi.setIsShowPageLoading(this.isShowPageLoading)
    this.imageApi.setToast(this.toast)
    this.toast.setBvToast(this.$bvToast)

    this.columnNumber = this.getColumnNumber()
    this.areas = new Array(this.columnNumber).fill([])

    window.addEventListener('scroll', () => {
      this.outerLoop()
    })

    this.setParamsAndInit()
  },
  methods: {
    setParamsAndInit () {
      try {
        const username = this.$route.params.username
        const code = this.$route.params.code
        const time = this.$route.params.time

        if (username) {
          this.keyword = username
          this.search()
        } else if (code) {
          this.keyword = `/p/${code}/`
          this.search()
        } else if (time) {
          throw new Error('개발중인 기능입니다.')
        }
      } catch (error) {
        console.error(error)
        this.toast.send(error.message)
      }
    },
    async search () {
      try {
        this.lastPage = false
        this.page = 1
        this.nowfiles = []
        const { mode, key, seq, status } = await this.imageApi.search(this.keyword)
        if (status === 400) {
          throw new Error('잘못된 요청입니다.')
        }
        if (status === 403) {
          throw new Error('비공개 계정입니다.')
        }
        if (status === 410) {
          throw new Error('feed가 없습니다.')
        }
        if (status === 404) {
          throw new Error('페이지를 찾을 수 없습니다.')
        }
        if (status === 204) {
          throw new Error('피드가 없습니다.')
        }
        if (status !== 101 && status !== 200) {
          throw new Error('요청에 실패했습니다.')
        }

        this.imageApi.setMode(mode)
        this.imageApi.setSeq(seq)
        if (mode === 'user') {
          history.pushState({}, 'search', `/${key}/`)
        } else if (mode === 'post') {
          history.pushState({}, 'search', `/p/${key}/`)
        }
        this.emptyFile()
        this.outerLoop()
      } catch (error) {
        console.error(error)
        this.toast.send(error.message)
      }
    },

    emptyFile () {
      for (let index = 0; index < this.areas.length; index++) {
        const imageWrapper = this.$refs[`imageWrapper_${index}`][0]
        imageWrapper.innerHTML = ''
      }
    },

    async outerLoop  () {
      if (this.isProcessing || !this.shouldLoadMore()) {
        return
      }

      this.isProcessing = true
      this.showLoadingIcon()

      // 충전
      if (this.nowfiles.length === 0) {
        if (this.lastPage === false) {
          const res = await this.imageApi.fetchFiles(this.page)
          this.nowfiles = res // TODO::this.areas에 쌓아야함
          this.lastPage = res[0].lastPage
          this.page++
        // 마지막 이미지
        } else {
          this.isProcessing = false
          this.hideLoadingIcon()
          return
        }
      }
      const file = this.nowfiles.shift()
      this.appendImage(file)
    },

    shouldLoadMore  () {
      const lastCheckers = []
      for (let index = 0; index < this.areas.length; index++) {
        lastCheckers.push(this.$refs[`lastChecker_${index}`][0])
      }
      return Array.from(lastCheckers).some(checker => this.isElementVisible(checker))
    },

    appendImage (imageData) {
      const imageWrappers = []
      for (let index = 0; index < this.areas.length; index++) {
        imageWrappers.push(this.$refs[`imageWrapper_${index}`][0])
      }
      const minHeightIndex = this.findMinHeightIndex()
      const imageWrapper = imageWrappers[minHeightIndex]
      const imgElement = new Image()
      imgElement.src = imageData.imageUrl
      imgElement.title = imageData.code
      imgElement.style.width = '100%' // 너비 지정
      imgElement.style.display = 'none'
      if (this.columnNumber === 2) {
        imgElement.style.borderRadius = '6px'
        imgElement.style.padding = '3px'
      } else {
        imgElement.style.borderRadius = '20px'
        imgElement.style.padding = '10px'
      }
      imageWrapper.appendChild(imgElement)
      this.loadImage(imgElement)
    },

    findMinHeightIndex () {
      const imageWrappers = []
      for (let index = 0; index < this.areas.length; index++) {
        imageWrappers.push(this.$refs[`imageWrapper_${index}`][0])
      }
      const heights = Array.from(imageWrappers, wrapper => wrapper.offsetHeight)
      const minHeight = Math.min(...heights)
      return heights.indexOf(minHeight)
    },

    async loadImage (imgElement) {
      try {
        const loadImagePromise = new Promise((resolve, reject) => {
          imgElement.onload = () => resolve('이미지가 성공적으로 로드되었습니다')
          imgElement.onerror = () => reject('이미지 로드 중 오류가 발생했습니다')
        })
        const timeoutPromise = new Promise((resolve, reject) => {
          setTimeout(() => reject('이미지 로딩 시간이 초과되었습니다'), 10000)
        })
        await Promise.race([loadImagePromise, timeoutPromise])
        this.hideLoadingIcon()
        imgElement.style.display = 'inline'
      } catch (error) {
        console.error(error)
        // const seq = imgElement.getAttribute('title')
        // this.imageApi.errorImage(seq)
        imgElement.src = this.xboxImageUrl
        this.hideLoadingIcon()
        imgElement.style.display = 'inline'
      } finally {
        this.isProcessing = false
        this.outerLoop()
      }
    },

    showLoadingIcon  () {
      const loadingIcons = []
      for (let index = 0; index < this.areas.length; index++) {
        loadingIcons.push(this.$refs[`loadingIcon_${index}`][0])
      }
      const index = this.findMinHeightIndex()
      const loadingIcon = loadingIcons[index]
      loadingIcon.style.display = 'inline-block'
    },

    hideLoadingIcon  () {
      const loadingIcons = []
      for (let index = 0; index < this.areas.length; index++) {
        loadingIcons.push(this.$refs[`loadingIcon_${index}`][0])
      }
      const index = this.findMinHeightIndex()
      const loadingIcon = loadingIcons[index]
      loadingIcon.style.display = 'none'
    },

    isElementVisible  (element) {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight || document.documentElement.clientHeight
      return rect.top <= windowHeight && rect.bottom >= 0
    },

    getColumnNumber () {
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      if (windowWidth <= 768) {
        return 2
      } else if (windowWidth <= 1920) {
        return 3
      }
      return 4
    }
  }
}
</script>

<style scoped>
a {
    color: inherit;
    text-decoration: none;
}

a:hover {
    color: inherit;
    text-decoration: none;
}

.flex-container {
    display: flex;
    flex-direction: column; /* 세로 방향 정렬 */
    background-image: url('static/images/woman-star-dark.jpg');
    background-size:100%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

.top-section {
    display: flex;
    height: 50px;
    justify-content: space-between;
    align-items: center;
}

.bottom-section {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height:450px;
    color:#fff;
}

.wrap { padding-left:20px; padding-right:20px; padding-bottom:25px;}
.testDiv {position: relative; margin-top:20px;}
.testInput {border:0; border-radius:50px; height:50px;}
.testBtn {position: absolute; top:12px; right:15px; ;border:0; border-radius: 10px; background-color:#ddd;}

@media (max-width: 992px) {
 .testInput {width:100%; padding-left:10px; font-size:11px; }
}
@media (min-width: 992px) {
 .testInput { width: 700px; padding-left:40px;}
}

.image-container {
    display: flex;
}

.image-container .image-area {
    width: 100%;
}

/*
.image-container .image-area .image-wrapper img {
    display: none;
    width: 100%;
    vertical-align: middle;
    box-sizing: border-box;
}
*/
.image-container .image-area .loading-icon {
    display: none;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: calc(50% - 15px) calc(50% - 15px);
}

.image-container .image-area .last-checker {
    padding: 1px 0 0 0;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
