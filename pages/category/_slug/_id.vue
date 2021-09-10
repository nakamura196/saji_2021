<template>
  <div>
    <BMenu :items="bh"></BMenu>
    <v-container class="my-5">
      <!-- background-color="primary" dark  -->
      <v-tabs class="mb-10" show-arrows>
        <template v-for="(aggList, aggField) in config.aggs">
          <v-tab
            v-if="!aggList.hide"
            :key="aggField"
            class="ma-1"
            depressed
            color="primary"
            :to="
              localePath({
                name: 'category-slug-id',
                params: { slug, id: aggField },
              })
            "
            >{{ aggList.label }}</v-tab
          >
        </template>
      </v-tabs>

      <h2 class="my-5">{{ $route.params.id }}</h2>

      <template v-if="loading">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-circular>

          <p>
            初回はインデックスファイルのダウンロードに時間を要します。2回目以降はキャッシュにより待ち時間が改善します。
          </p>
        </div>
      </template>

      <template v-else>
        <v-tabs v-model="tabs" right>
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#mobile-tabs-5-1" class="primary--text">
            <v-icon>mdi-table</v-icon>
          </v-tab>

          <v-tab href="#mobile-tabs-5-2" class="primary--text">
            <v-icon>mdi-chart-bar</v-icon>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabs" class="mt-10">
          <v-tab-item :value="'mobile-tabs-5-1'">
            <v-card flat>
              <v-card-title>
                <v-text-field
                  v-model="searchAgg"
                  filled
                  rounded
                  append-icon="mdi-magnify"
                  dense
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :items-per-page="20"
                :footer-props="{
                  'items-per-page-options': [20, 50, 100, -1],
                }"
                :headers="headersAggs"
                :items="itemsAggs"
                :search="searchAgg"
              >
                <template v-slot:item.label="{ item }">
                  <nuxt-link
                    :to="
                      localePath({
                        name: 'search-slug',
                        params: {
                          slug: slug,
                        },
                        query: getQuery(item.label),
                      })
                    "
                  >
                    <c-render :value="item.label"></c-render>
                  </nuxt-link>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>

          <v-tab-item :value="'mobile-tabs-5-2'">
            <BarChart
              class="mt-10"
              :labels="labels"
              :datasets="datasets"
            ></BarChart>
          </v-tab-item>
        </v-tabs-items>
      </template>
    </v-container>
  </div>
</template>

<script>
// import axios from 'axios'
import BMenu from '~/components/BMenu.vue'
import BarChart from '~/components/BarChart'
import CRender from '~/components/common/view/CRender.vue'

export default {
  components: {
    BarChart,
    BMenu,
    CRender,
  },
  data() {
    return {
      slug: this.$route.params.slug || 'default',
      itemsAggs: [],

      headersAggs: [
        {
          text: this.$t('name'),
          value: 'label',
        },
        {
          text: this.$t('results'),
          value: 'value',
        },
      ],

      searchAgg: '',
      loading: true,

      tabValue: null,
      tabs: null,

      labels: [],
      datasets: [],
    }
  },

  computed: {
    config: {
      get() {
        const slug = this.slug
        const config = process.env.config[slug]
        return config
      },
      set() {},
    },

    bh() {
      const config = this.config
      return [
        {
          text: this.$t('top'),
          disabled: false,
          to: this.localePath({ name: 'index' }),
          exact: true,
        },
        {
          text: this.$t('category'),
          disabled: false,
          to: this.localePath({ name: 'category' }),
          exact: true,
        },
        {
          text: config.label,
          disabled: false,
          to: this.localePath({
            name: 'category-slug',
            params: { slug: this.slug },
          }),
          exact: true,
        },
        {
          text: this.$route.params.id,
        },
      ]
    },
  },

  watch: {
    $route() {
      // ヘッダーからの検索対応
      const query = this.$route.query
      if (query['main[query]']) {
        this.q = query['main[query]']
      }

      // フィルタの実行条件は要検討
      this.filter()

      this.list()
    },
  },

  async mounted() {
    const config = this.config
    const { docs, fulltextMap, facets } = await this.$indexUtils.init(config)

    const query = JSON.parse(JSON.stringify(this.$route.query))

    const f = await this.$indexUtils.filter(
      fulltextMap,
      docs,
      facets,
      config,
      config.defaultSort,
      query
    )

    const filteredIds = f.ids

    const aggs = this.$indexUtils.getAggs(docs, filteredIds, config)

    // 表示用

    const items = []
    const data = []
    const labels = []

    for (const obj of aggs[this.$route.params.id].value) {
      items.push({
        label: obj[0],
        value: obj[1],
      })
    }

    items.sort(function (a, b) {
      if (a.value < b.value) return 1
      if (a.value > b.value) return -1
      return 0
    })

    for (const obj of items) {
      labels.push(obj.label)
      data.push(obj.value)
    }

    this.itemsAggs = items
    this.labels = labels
    this.datasets = [{ data, label: this.$t('item') }]

    this.loading = false
  },

  methods: {
    getQuery(value) {
      const obj = {}
      obj['main[refinementList][' + this.$route.params.id + '][0]'] = value
      return obj
    },
  },

  head() {
    return {
      title:
        this.$t('category') +
        ': ' +
        this.$t(this.config.label) +
        ' - ' +
        this.$route.params.id,
    }
  },
}
</script>
