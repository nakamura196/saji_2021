<template>
  <div>
    <v-row>
      <v-col cols="12" sm="9"></v-col>
      <v-col cols="12" sm="3">
        <v-select
          v-model="item"
          hide-details
          class="mb-0"
          outlined
          rounded
          :items="items"
          dense
          label="切り替え"
          @change="changeValue()"
        ></v-select>
      </v-col>
    </v-row>

    <v-snackbar v-model="dialog" :timeout="2000" :vertical="true">
      通番の種類が
      {{ thres }} 件以下になるように、検索結果を絞り込んでください。

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="dialog = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'nuxt-property-decorator'

import ResultOption from '~/components/display/ResultOption.vue'

@Component({
  components: {
    ResultOption,
  },
})
export default class FullTextSearch extends Vue {
  item: string = ''

  @Prop({})
  aggs!: any

  mounted() {
    let slug = this.$route.params.slug
    if (!slug) {
      slug = 'default'
    }
    this.item = slug
  }

  dialog: boolean = false

  items: any = [
    {
      text: '所在',
      value: 'tree',
    },
    {
      text: '書名目録',
      value: 'default',
    },
    {
      text: '詳細目録',
      value: 'advanced',
    },
  ]

  thres: number = 50

  changeValue() {
    const item = this.item

    if (item === 'tree') {
      this.$router.push(
        this.localePath({
          name: 'tree',
        })
      )
    } else {
      const values = this.aggs['通番'].value

      if (values.length > this.thres) {
        this.dialog = true
        return
      }

      const query: any = {}
      for (let i = 0; i < values.length; i++) {
        query[`main[refinementList][通番][${i}]`] = values[i][0]
      }

      this.$router.push(
        this.localePath({
          name: 'search-slug',
          params: { slug: item },
          query,
        })
      )
    }
  }
}
</script>
