<template>
  <div>
    <BMenu :items="bh"></BMenu>
    <v-container class="my-5">
      <h2 class="mb-5">{{ title }}</h2>

      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Label
              </th>
              <th class="text-left">
                URL
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in items" :key="key">
              <td>{{ item.label }}</td>
              <td>
                <a :href="item.value">{{ item.value }}</a>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BMenu from '~/components/BMenu.vue'

@Component({
  components: {
    BMenu,
  },
})
export default class Page extends Vue {
  get title(): any {
    return this.$t('dataset')
  }

  head() {
    return {
      title: this.title,
    }
  }

  get bh(): any[] {
    return [
      {
        text: this.$t('top'),
        disabled: false,
        to: this.localePath({ name: 'index' }),
        exact: true,
      },
      {
        text: this.$t(this.title),
      },
    ]
  }

  items: any[] = [
    {
      label: '酉蓮社本（IIIFコレクション）',
      value:
        'https://www.kanzaki.com/works/2016/pub/image-annotator?u=https://static.toyobunko-lab.jp/u-renja/iiif2/collection/top.json',
    },
    {
      label: '『大正新脩大蔵経勘同目録』（IIIFマニフェスト）',
      value:
        'https://www.kanzaki.com/works/2016/pub/image-annotator?u=https://static.toyobunko-lab.jp/taishozo/iiif/kandomokuroku/manifest.json',
    },
    /*
    {
      label: 'メタデータ一覧（Excel）',
      value:
        'https://view.officeapps.live.com/op/view.aspx?src=https://static.toyobunko-lab.jp/u-renja/metadata/data.xlsx',
    },
    */
  ]
}
</script>
