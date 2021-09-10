<template>
  <div>
    <table
      border="1"
      style="border-collapse: collapse;"
      width="100%"
      class="my-2"
    >
      <thead>
        <tr>
          <th style="cursor: pointer;" @click="flg1 = !flg1">
            <template v-if="!flg1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ flg1 ? '◀︎ 分類' : '▶︎' }}</span>
                </template>
                <span>分類を開く</span>
              </v-tooltip>
            </template>
            <template v-else>
              ◀︎ 分類
            </template>
          </th>
          <th>函册</th>
          <th>經番</th>
          <th>通番</th>
          <th>經典名稱・卷數</th>
          <th>譯著者</th>
          <th>版式</th>
          <th>刊記</th>
          <th>備考</th>
          <th style="cursor: pointer;" @click="flg2 = !flg2">
            <template v-if="!flg2">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on"> 寸法{{ flg2 ? '' : ' ▶︎' }} </span>
                </template>
                <span>寸法(備考)を開く</span>
              </v-tooltip>
            </template>
            <template v-else>
              寸法
            </template>
          </th>
          <th v-if="flg2" style="cursor: pointer;" @click="flg2 = !flg2">
            ◀︎ 寸法（備考）
          </th>
          <th>大正藏採録状況</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(obj, index) in items" :key="index">
          <td>
            {{ flg1 ? bunrui(obj) : '' }}
          </td>
          <td>{{ tana(obj) }}</td>
          <td>{{ $utils.formatArrayValue(obj['經番']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['通番']) }}</td>

          <td>
            {{ $utils.formatArrayValue(obj['經典名稱・卷數']) }}
            <template v-if="obj.relatedLink && obj.relatedLink.length > 0">
              <template v-for="(item2, key2) in obj.relatedLink">
                <span v-if="item2" :key="key2" class="mx-1">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span v-on="on">
                        <a
                          :href="`http://www.kanzaki.com/works/2016/pub/image-annotator?u=${item2.id}`"
                          target="_blank"
                        >
                          <img
                            width="30px"
                            src="https://pbs.twimg.com/profile_images/596366309601845248/2uaPY5NH.png"
                          />
                        </a>
                      </span>
                    </template>
                    <span>{{ item2.label }}の画像を開く</span>
                  </v-tooltip>
                </span>
              </template>
            </template>
          </td>
          <td>
            {{ $utils.formatArrayValue(obj['譯著者']) }}
          </td>
          <td>
            {{ $utils.formatArrayValue(obj['版式']) }}
          </td>
          <td>
            {{ $utils.formatArrayValue(obj['刊記']) }}
          </td>
          <td>
            {{ $utils.formatArrayValue(obj['備考']) }}
          </td>
          <td>
            {{ size(obj) }}
          </td>
          <td v-if="flg2">
            {{ $utils.formatArrayValue(obj['寸法（備考）']) }}
          </td>
          <td v-html="status(obj)"></td>
        </tr>
      </tbody>
    </table>
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
  baseUrl: any = process.env.BASE_URL
  @Prop({})
  items!: any[]

  flg1: boolean = false
  flg2: boolean = false

  bunrui(obj: any) {
    return (
      this.$utils.formatArrayValue(obj['分類(1)']) +
      ' ' +
      (obj['分類(2)'] ? this.$utils.formatArrayValue(obj['分類(2)']) : '') +
      (obj['分類(3)'] ? ' ' + this.$utils.formatArrayValue(obj['分類(3)']) : '')
    )
  }

  tana(obj: any) {
    return (
      this.$utils.formatArrayValue(obj['函册']) +
      (obj['函册(to)'] && obj['函册(to)'][0] !== ''
        ? '~' + this.$utils.formatArrayValue(obj['函册(to)'])
        : '') +
      (obj['函册(闕)'] ? this.$utils.formatArrayValue(obj['函册(闕)']) : '')
    )
  }

  /*
  icons(obj: any) {
    const results = []
    if (obj.relatedLink) {
      const manifests = obj.relatedLink
      for (const m of manifests) {
        const text =
          '<a href="http://www.kanzaki.com/works/2016/pub/image-annotator?u=' +
          m +
          '" target="_blank"><img width="30px" src="https://pbs.twimg.com/profile_images/596366309601845248/2uaPY5NH.png"/></a>'
        results.push(text)
      }
    }
    return results // .join('  ')
  }
  */

  size(obj: any) {
    return (
      (this.$utils.formatArrayValue(obj['寸法(縦）']) || '') +
      '×' +
      (this.$utils.formatArrayValue(obj['寸法(横)']) || '') +
      '(' +
      (this.$utils.formatArrayValue(obj['寸法（計測箇所）']) || '') +
      ')'
    )
  }

  status(obj: any) {
    const results = []

    for (let i = 1; i < 5; i++) {
      const label = i === 1 ? '大正藏經典番號' : '大正藏經典番号'

      const value = obj[label + '(' + i + ')']

      if (!value || !this.$utils.formatArrayValue(value)) {
        continue
      }
      results.push(
        '<a href="https://static.toyobunko-lab.jp/taishozo/search?main[query]=' +
          this.$utils.formatArrayValue(value) +
          '" target="_blank">' +
          this.$utils.formatArrayValue(value) +
          this.$utils.formatArrayValue(obj['大正藏採録種別(' + i + ')']) +
          '(' +
          this.$utils.formatArrayValue(
            obj['大正藏脚注テキスト標準名称(' + i + ')']
          ) +
          ')' +
          '</a>'
      )
    }
    return results.join('<br/>')
  }
}
</script>
