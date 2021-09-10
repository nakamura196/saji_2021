<template>
  <!-- <div class="ml-10"> -->
  <!-- background-color="grey lighten-2" -->
  <v-text-field
    v-model="q"
    light
    single-line
    filled
    rounded
    dense
    hide-details
    :label="$t('search')"
    clearable
    clear-icon="mdi-close-circle"
    append-icon="mdi-magnify"
    :background-color="backgroundColor"
    @click:append="search"
    @keydown.enter="trigger"
  ></v-text-field>
  <!-- </div> -->
  <!-- class="mr-2" dark -->
</template>

<script lang="ts">
import { Prop, Vue, Component, Watch } from 'nuxt-property-decorator'

@Component({})
export default class FullTextSearch extends Vue {
  q: any = ''

  @Prop({ default: 'white' })
  backgroundColor!: string

  @Prop({})
  to!: string

  @Watch('$route')
  watchRoute() {
    const query = this.$route.query
    if (query['main[query]']) {
      this.q = query['main[query]']
    }
  }

  trigger(event: any) {
    // 日本語入力中のEnterキー操作は無効にする
    if (event.keyCode !== 13) return
    this.search()
  }

  created() {
    const query = this.$route.query
    if (query['main[query]']) {
      this.q = query['main[query]']
    }
  }

  search() {
    let keywordStr = this.q

    if (!keywordStr) {
      keywordStr = ''
    } else {
      keywordStr = keywordStr.trim()
    }

    const keywords = this.$searchUtils.splitKeyword(keywordStr)

    // push 処理
    const query: any = Object.assign({}, this.$route.query)
    const values: string[] = []
    for (let i = 0; i < keywords.length; i++) {
      const keyword: any = keywords[i]
      if (keyword.label === 'keyword') {
        values.push(keyword.value)
      }
    }
    // query.keyword = values
    query['main[query]'] = keywordStr
    query['main[page]'] = 1

    const to: any = this.to
    to.query = query
    this.$router.push(this.localePath(to))
  }
}
</script>
