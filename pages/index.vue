<template>
  <div>
    <v-sheet color="grey">
      <v-img height="400" contain :src="slides[0]"></v-img>
    </v-sheet>
    <v-container>
      <p class="text-right">
        <v-chip class="text-right" label
          >酉蓮社本を収める経箱。1箱に3函を納める。</v-chip
        >
      </p>
    </v-container>

    <v-container class="my-10">
      <div class="mb-5 pb-5 text-center">
        <img class="my-5" width="90" :src="baseUrl + '/img/「猶龍窟」印.png'" />
        <h2>{{ $t(siteName) }}</h2>
        <p class="py-5" v-html="siteDesc"></p>

        <p>以下からお試しください。</p>

        <v-btn
          class="ma-2"
          dark
          color="primary"
          :to="
            localePath({
              name: 'tree',
            })
          "
        >
          {{ '所在' }}
        </v-btn>

        <v-btn
          class="ma-2"
          dark
          color="primary"
          :to="
            localePath({
              name: 'search-slug',
            })
          "
        >
          {{ '書名目録' }}
        </v-btn>

        <v-btn
          class="ma-2"
          dark
          color="primary"
          :to="
            localePath({
              name: 'search-slug',
              params: { slug: 'advanced' },
            })
          "
        >
          {{ '詳細目録' }}
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Page extends Vue {
  head() {
    return {
      titleTemplate: null,
    }
  }

  baseUrl: any = process.env.BASE_URL

  siteName: any = '酉蓮社（旧増上寺報恩蔵）蔵嘉興版大蔵経目録データベース'
  siteDesc: any =
    '酉蓮社（旧増上寺報恩蔵）蔵嘉興版大蔵経目録データベースへようこそ'

  slides: string[] = [process.env.BASE_URL + '/img/経箱画像.png']
}
</script>
