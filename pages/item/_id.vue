<template>
  <div>
    <v-container v-if="apiResult">
      <h2 class="text-center my-5">
        {{ $t('詳細情報') }}
      </h2>

      {{ apiResult }}
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import ShareButtons from '~/components/common/ShareButtons.vue'

@Component({
  components: {
    ShareButtons,
  },
})
export default class Search extends Vue {
  apiResult: any = null

  uri: string = ''
  url: string = ''
  title: string = ''
  id: string = ''

  async asyncData(context: any) {
    const itemId = `${context.params.id}`
    const uri = process.env.BASE_URL + '/data/item/' + itemId + '.json'
    const apiResult = await context.$axios
      .get(uri)
      .then((response: any) => {
        const apiResult = response.data
        return apiResult
      })
      .catch((error: any) => {
        // eslint-disable-next-line
        console.error(error)
      })

    return {
      id: itemId,
      apiResult,
      uri,
      title: itemId,
    }
  }

  /*
  get satUrl(): string {
    const data = this.data
    return (
      'https://21dzk.l.u-tokyo.ac.jp/SAT2018/' +
      data['基本情報-経典番号'] +
      '_.' +
      ('00' + data['SAT頭出し用']['開始巻']).slice(-2) +
      '.' +
      ('0000' + data['SAT頭出し用']['ページ']).slice(-4) +
      data['SAT頭出し用']['段'] +
      ('00' + data['SAT頭出し用']['行']).slice(-2) +
      '.html'
    )
  }
  */

  get twitterUrl() {
    return (
      'https://twitter.com/intent/tweet?url=' + this.url + '&text=' + this.title
    )
  }

  get facebookUrl() {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + this.url
  }

  get pocketUrl() {
    return 'http://getpocket.com/edit?url=' + this.url
  }

  head() {
    return {
      title: this.$t('詳細情報') + ': ' + this.title,
    }
  }
}
</script>
