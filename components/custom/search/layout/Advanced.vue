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
          <th>連</th>
          <th>箱</th>
          <th>段</th>
          <th>冊</th>
          <th>闕</th>
          <th>函册次</th>
          <th>經番</th>
          <th>通番</th>
          <th>枝番</th>
          <th>千字文</th>
          <th>經典名稱</th>
          <th>卷次等</th>
          <th>丁數</th>
          <th>卷末附録</th>
          <th>刊記</th>
          <th>圖像</th>
          <th>詳細情報</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(obj, index) in items" :key="index">
          <td>{{ $utils.formatArrayValue(obj['連']) }}</td>
          <td>{{ Number($utils.formatArrayValue(obj['箱'])) }}</td>
          <td>{{ $utils.formatArrayValue(obj['段']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['冊']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['闕']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['函册次']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['經番']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['通番']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['枝番']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['千字文']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['經典名稱']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['卷次等']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['丁數']) }}</td>
          <td>
            {{ $utils.formatArrayValue(obj['卷末附録_facet'], ' ') }}
          </td>
          <td>{{ $utils.formatArrayValue(obj['刊記']) }}</td>
          <td>{{ $utils.formatArrayValue(obj['圖像']) }}</td>
          <td>
            <nuxt-link
              :to="
                localePath({
                  name: 'item-id',
                  params: {
                    id: obj.objectID,
                  },
                })
              "
              >{{ 'more' }}
            </nuxt-link>
          </td>
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
}
</script>
