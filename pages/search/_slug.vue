<template>
  <div>
    <v-sheet v-if="isBc" color="grey lighten-2">
      <v-container fluid class="py-4">
        <v-breadcrumbs class="py-0" :items="bh">
          <template #divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-container>
    </v-sheet>
    <v-container class="my-5">
      <h2>{{ title }}</h2>

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
        <v-row class="mt-2" dense justify="center" align-content="center">
          <v-col cols="12" sm="10">
            <FullTextSearch
              background-color="grey lighten-3"
              :to="config.to"
            ></FullTextSearch>
          </v-col>

          <v-col
            v-if="advancedOptions.length > 0"
            cols="12"
            sm="2"
            class="text-right"
          >
            <v-btn
              rounded
              depressed
              color="grey lighten-2"
              @click="isAdvanced = !isAdvanced"
            >
              <v-icon class="mr-1">mdi-menu</v-icon> {{ $t('detail') }}
            </v-btn>
          </v-col>
        </v-row>

        <div v-show="isAdvanced" class="py-10">
          <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
              <SearchAdvanced></SearchAdvanced>
            </v-col>
            <v-col cols="3"></v-col>
          </v-row>
        </div>

        <div v-if="filters.length > 0" class="mt-5">
          <template v-for="(e, key) in filters">
            <!-- この条件分岐は要検討 -->
            <v-chip
              v-if="aggs[e.label]"
              :key="key"
              class="mr-2 my-2"
              close
              label
              @click:close="faceted(e.label, e.value)"
            >
              {{ aggs[e.label].label }}: <c-render :value="e.value" />
            </v-chip>
          </template>

          <v-chip
            v-if="filters.length > 0"
            label
            class="mr-2 my-2"
            @click="init()"
          >
            {{ $t('clear') }}
          </v-chip>
        </div>

        <ViewSwitch class="mt-5" :aggs="aggs"></ViewSwitch>

        <v-row class="mt-5" dense>
          <v-col cols="12" md="4">
            <h3 class="my-0">
              <v-btn
                fab
                depressed
                color="primary"
                small
                class="mr-2"
                @click="isFacetOpen = !isFacetOpen"
                ><v-icon>mdi-menu</v-icon></v-btn
              >

              {{ $t('search_result') }}: {{ total.toLocaleString() }}
              {{ $t('hits') }}
            </h3>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select
              v-model="size"
              hide-details
              outlined
              rounded
              :items="itemPerPages"
              dense
              @change="changeHitsPerPage()"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="sort"
              hide-details
              class="mb-0"
              outlined
              rounded
              :items="sortItems"
              dense
              @change="changeSort()"
            ></v-select>
          </v-col>

          <v-col cols="12" md="3" class="text-right">
            <span>表示スタイル</span>
            <v-btn
              v-for="(option, key) in layouts"
              :key="key"
              icon
              @click="changeLayout(option.value)"
              ><v-icon :color="layout_ === option.value ? 'primary' : ''">{{
                option.icon
              }}</v-icon></v-btn
            >
          </v-col>
        </v-row>

        <div v-show="isPagination" v-if="false" class="text-center mt-10">
          <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
          ></v-pagination>
        </div>

        <v-row class="mt-5">
          <v-col cols="12" :sm="isFacetOpen ? 9 : 12" order-sm="12">
            <component
              :is="searchLayout"
              :items="items"
              :aggs="aggs"
              :q="q"
            ></component>

            <template v-if="layout_ === 'image'">
              <v-row>
                <v-col
                  v-for="item in items"
                  :key="item.objectID"
                  cols="12"
                  sm="3"
                >
                  <nuxt-link
                    :to="
                      localePath({
                        name: 'item-id',
                        params: { id: item.objectID },
                      })
                    "
                  >
                    <!-- query, -->
                    <v-img
                      contain
                      max-height="150"
                      style="height: 150px;"
                      width="100%"
                      class="grey lighten-2"
                      :src="item.thumbnail"
                    />
                  </nuxt-link>
                </v-col>
              </v-row>
            </template>
          </v-col>

          <v-col v-show="isFacetOpen" cols="12" sm="3" order-sm="1">
            <template v-for="(aggList, aggField) in aggs">
              <v-expansion-panels
                v-if="!aggList.hide"
                :key="aggField"
                :value="isEachFacetOpen(aggField, aggList) ? 0 : 1"
                flat
                class="mb-4"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="grey lighten-2">
                    <h3>
                      {{ aggList.label }}
                      <small class="ml-2"
                        >({{ aggList.value.length.toLocaleString() }}
                        {{ $t('results') }})</small
                      >
                    </h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content outlined class="py-2">
                    <template v-for="(e, key) in aggList.value">
                      <template v-if="key < limit">
                        <v-row
                          :key="'2_' + key"
                          align="center"
                          justify="center"
                          dense
                        >
                          <v-col
                            style="cursor: pointer;"
                            cols="8"
                            @click="faceted(aggField, e[0])"
                          >
                            <template v-if="checked(aggField, e[0])">
                              <v-icon color="primary">
                                mdi-checkbox-marked
                              </v-icon>
                            </template>
                            <template v-else>
                              <v-icon> mdi-checkbox-blank-outline </v-icon>
                            </template>

                            <c-render :value="e[0]"></c-render>
                          </v-col>
                          <v-col cols="3">
                            {{ e[1] }}
                            <!-- <v-chip small>
                            {{ e[1] }}
                          </v-chip> -->
                          </v-col>
                          <v-col class="text-right" cols="1">
                            <v-btn
                              v-if="!checked(aggField, e[0])"
                              icon
                              @click="faceted(aggField, '-' + e[0])"
                              ><v-icon>mdi-close-circle-outline</v-icon></v-btn
                            >
                          </v-col>
                        </v-row>

                        <v-divider :key="'d-' + key" />
                      </template>
                    </template>
                    <template v-for="(e, key) in getMinusValues(aggField)">
                      <v-row
                        :key="'r_' + key"
                        style="cursor: pointer;"
                        align="center"
                        justify="center"
                        dense
                        @click="faceted(aggField, e)"
                      >
                        <!-- :key="'rm_' + key" -->
                        <v-col cols="12"
                          ><v-icon color="primary">
                            mdi-checkbox-blank
                          </v-icon>

                          <c-render :value="e.substring(1)"></c-render
                        ></v-col>
                      </v-row>
                      <v-divider :key="'d2-' + key" />
                    </template>

                    <!-- 表示 -->

                    <div class="text-right">
                      <!-- v-if="aggList.value.length > limit" -->
                      <v-btn
                        color="primary"
                        small
                        text
                        class="mt-4"
                        @click="showAll(aggList)"
                        >{{ $t('show all') }}
                        <v-icon>mdi-menu-right</v-icon></v-btn
                      >
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
          </v-col>
        </v-row>

        <div v-show="isPagination" class="text-center mt-10">
          <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
          ></v-pagination>
        </div>
      </template>
    </v-container>

    <v-dialog v-model="isShowAll">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          <span class="text-h5">{{ selectedAgg.label }}</span>
        </v-card-title>
        <v-card-text style="height: 600px; overflow-y: auto;" class="py-5">
          <!-- :items-per-page="-1" -->
          <v-data-table
            v-model="selected"
            :headers="[
              { text: this.$t('name'), value: 'label' },
              { text: this.$t('results'), value: 'value' },
            ]"
            :items="selectedAggValues"
            item-key="label"
            :search="facetSearch"
            :items-per-page="20"
            :footer-props="{
              'items-per-page-options': [20, 50, 100, -1],
            }"
            show-select
          >
            <template v-slot:top>
              <v-text-field
                v-model="facetSearch"
                background-color="grey lighten-3"
                filled
                rounded
                dense
                hide-details
                :placeholder="$t('add_a_search_term')"
                append-icon="mdi-magnify"
                clearable
                clear-icon="mdi-close-circle"
                label="Search"
                class="mx-4 my-5"
              ></v-text-field>
            </template>

            <template v-slot:item.label="{ item }">
              <template v-if="item.label === ''">
                <span style="color: #4caf50;">{{ $t('none') }}</span>
              </template>
              <template v-else>
                {{ item.label }}
              </template>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="isShowAll = false">
            {{ $t('cancel') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="
              isShowAll = false
              faceted(selectedAgg.key, getLabels(selected), 'all')
            "
          >
            {{ $t('refine') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
import FullTextSearch from '~/components/search/FullTextSearch.vue'
import SearchAdvanced from '~/components/search/Advanced.vue'
import SearchLayoutGraph from '~/components/search/layout/Graph.vue'
import SearchLayoutGrid from '~/components/search/layout/Grid.vue'
import SearchLayoutList from '~/components/search/layout/List.vue'
import CustomSearchLayoutTable from '~/components/custom/search/layout/Table.vue'
import CustomSearchLayoutAdvanced from '~/components/custom/search/layout/Advanced.vue'
import ViewSwitch from '~/components/custom/search/ViewSwitch.vue'

import CRender from '~/components/common/view/CRender.vue'

export default {
  components: {
    FullTextSearch,
    SearchAdvanced,
    SearchLayoutGraph,
    CustomSearchLayoutTable,
    CustomSearchLayoutAdvanced,
    SearchLayoutGrid,
    SearchLayoutList,
    ViewSwitch,
    CRender,
  },
  data() {
    return {
      slug: this.$route.params.slug,
      page: 1,
      sort: '',
      layout_: '', // process.env.defaultLayout,
      size: -1,
      total: 0,
      items: [],
      ids: [],
      q: '',
      limit: 5,
      aggs: {},
      facets: {},

      loading: true,

      isShowAll: false,

      selectedAggValues: [],
      selectedAgg: {},
      // selectedField: 'group',
      selected: [],
      facetSearch: '',

      // layouts: process.env.layout,

      isFacetOpen: true,
      isAdvanced: false,

      advancedOptions: process.env.advanced,

      isBc: process.env.bc,

      metadataList: process.env.list,

      // sortList: process.env.sort,

      isFacetOpenList: [],
    }
  },

  computed: {
    config: {
      get() {
        let slug = this.slug
        if (!slug) {
          slug = 'default'
        }
        const config = process.env.config[slug]
        return config
      },
      set() {},
    },
    aggsConfig: {
      get() {
        return this.config.aggs
      },
      set() {},
    },
    layouts: {
      get() {
        return this.config.layout
      },
      set() {},
    },
    /*
    sort: {
      get() {
        return this.config.defaultSort
      },
      set() {},
    },
    */
    sortList: {
      get() {
        return this.config.sort
      },
      set() {
        // this.sort = value value
      },
    },
    itemPerPages: {
      get() {
        const items = []
        for (const value of this.config.itemPerPages) {
          items.push({
            text: value + ' ' + this.$t('results'),
            value,
          })
        }
        return items
      },
      set() {
        // this.sort = value value
      },
    },
    title: {
      get() {
        return this.config.label
      },
      set() {
        // this.sort = value value
      },
    },
    bh: {
      get() {
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
      },
      set() {
        // this.sort = value value
      },
    },

    isPagination() {
      return this.layout_ !== 'graph'
    },
    length() {
      return Math.ceil(this.total / this.size)
    },
    filters() {
      const query = this.$route.query
      const filters = []
      for (const key in query) {
        if (key.includes('[refinementList]')) {
          filters.push({
            label: key.split('[')[2].split(']')[0],
            value: query[key],
          })
        }
      }
      return filters
    },
    sortItems() {
      const keys = ['asc', 'desc']
      const items = []
      for (const obj of this.sortList) {
        for (const key of keys) {
          items.push({
            text: obj.label + ' ' + this.$t(key),
            value: obj.value + ':' + key,
          })
        }
      }
      return items // [{ text: '適合度', value: '_score:desc' }]
    },
    searchLayout() {
      for (const option of this.layouts) {
        if (option.value === this.layout_) {
          return option.component
        }
      }
      return '' // 八日っ九人
    },
  },

  watch: {
    page(val) {
      // this.list(val)
      const query = JSON.parse(JSON.stringify(this.$route.query))

      if (val === 1) {
        delete query['main[page]']
      } else {
        query['main[page]'] = val
      }

      const to = this.config.to
      to.query = query
      this.$router.push(this.localePath(to))
    },

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
    // 初期読み込み
    const config = this.config
    const { docs, fulltextMap, facets } = await this.$indexUtils.init(config)

    this.index = fulltextMap
    this.docs = docs
    this.facets = facets

    this.initQueryProcess()

    this.filter()

    // 初期検索の場合
    this.list()

    this.loading = false
  },

  methods: {
    initQueryProcess() {
      // クエリの処理
      const query = this.$route.query

      // ページの初期化
      const page = Number(query['main[page]']) || this.page
      this.page = page

      // hitsPerPage
      const size = Number(query.size) || this.config.defaultItemPerPage
      this.size = size

      // sort
      const sort = query.sort || this.config.defaultSort
      this.sort = sort

      console.log(
        query.layout,
        sessionStorage.getItem('layout_' + this.baseUrl),
        '' + this.layout_,
        '' + this.config.defaultLayout
      )

      // レイアウト
      let layout = ''
      if (query.layout) {
        layout = query.layout
      } else if (sessionStorage.getItem('layout')) {
        layout = sessionStorage.getItem('layout')
      } else {
        layout = this.config.defaultLayout
      }
      // const layout = query['layout'] || this.layout_
      this.layout_ = layout

      // 検索キーワード
      const q = query['main[query]'] || this.q
      this.q = q
    },
    init() {
      // this.page = 1 //なぜかうまくいかない

      const query = JSON.parse(JSON.stringify(this.$route.query))
      for (const key in query) {
        if (key.includes('[refinementList]')) {
          delete query[key]
        }
      }

      // ページは先頭へ
      delete query['main[page]']

      const to = this.config.to
      to.query = query
      this.$router.push(this.localePath(to))
    },
    filter() {
      const query = JSON.parse(JSON.stringify(this.$route.query))

      // フィルタ
      const { ids, freq } = this.$indexUtils.filter(
        this.index,
        this.docs,
        this.facets,
        this.config,
        this.sort,
        query
      )

      // ソート
      const sortedIds = this.$indexUtils.sort(
        ids,
        this.facets,
        this.sort,
        freq,
        query,
        this.config
      )

      this.ids = sortedIds

      // その他
      this.total = sortedIds.length

      // facets
      this.getAggs()
    },
    getAggs() {
      this.aggs = this.$indexUtils.getAggs(this.docs, this.ids, this.config)
    },
    list() {
      const query = this.$route.query

      const page = query['main[page]'] || 1

      const hitsPerPage = query.size || 20 // 要検討

      const ids = this.ids

      const ids_ = ids.slice((page - 1) * hitsPerPage, page * hitsPerPage)
      const items = []
      for (const id of ids_) {
        items.push(this.docs[id])
      }
      this.items = items
    },

    faceted(field, selectedValues, type = 'default') {
      const query = JSON.parse(JSON.stringify(this.$route.query))

      if (typeof selectedValues === 'string') {
        selectedValues = [selectedValues]
      }

      let values = []
      for (const queryField in query) {
        if (queryField.includes('[refinementList][' + field + ']')) {
          if (type !== 'all') {
            // ここが重要
            values.push(query[queryField])
          }

          delete query[queryField]
        }
      }

      // リストに違いがなければ

      if (selectedValues.length !== 0) {
        for (const value of selectedValues) {
          if (values.includes(value)) {
            values = values.filter((n) => n !== value)
          } else {
            values.push(value)
          }
        }

        for (let i = 0; i < values.length; i++) {
          query['main[refinementList][' + field + '][' + i + ']'] = values[i]
        }
      }

      query['main[page]'] = 1

      const to = this.config.to
      to.query = query
      this.$router.push(this.localePath(to))
    },

    checked(field, value) {
      const query = this.$route.query

      const values = []
      for (const queryField in query) {
        if (queryField.includes('[refinementList][' + field + ']')) {
          values.push(query[queryField])
        }
      }

      if (values.includes(value)) {
        return true
      } else {
        return false
      }
    },

    changeHitsPerPage() {
      const query = JSON.parse(JSON.stringify(this.$route.query))

      const size = this.size

      if (size === 20) {
        delete query.size
      } else {
        query.size = size
      }

      const to = this.config.to
      to.query = query
      this.$router.push(this.localePath(to))
    },

    changeSort() {
      // console.log(this.sort)
      const query = JSON.parse(JSON.stringify(this.$route.query))
      query.sort = this.sort

      const to = this.config.to
      to.query = query
      this.$router.push(this.localePath(to))
    },

    changeLayout(value) {
      const query = JSON.parse(JSON.stringify(this.$route.query))
      const layout = value
      this.layout_ = layout

      if (layout === 'grid') {
        delete query.layout
      } else {
        query.layout = layout
      }

      const to = this.config.to
      to.query = query
      this.$router.push(this.localePath(to))

      sessionStorage.setItem('layout', value)
    },

    getMinusValues(field) {
      const query = JSON.parse(JSON.stringify(this.$route.query))

      const values = []
      for (const queryField in query) {
        if (queryField.includes('[' + field + ']')) {
          const value = query[queryField]
          if (value.startsWith('-')) {
            values.push(value)
          }
        }
      }
      return values
    },

    showAll(aggList) {
      const values = []
      for (const f of this.filters) {
        if (f.label === aggList.key) {
          values.push(f.value)
        }
      }
      this.selectedAgg = aggList
      const selected = []
      for (const e of aggList.value) {
        if (values.includes(e[0])) {
          selected.push({
            label: e[0],
            value: e[1],
          })
        }
      }

      const items = []
      for (const item of aggList.value) {
        items.push({
          label: item[0],
          value: item[1],
        })
      }

      this.selected = selected
      this.isShowAll = true
      this.selectedAggValues = items

      this.facetSearch = ''
    },

    getLabels(values) {
      const labels = []
      for (const item of values) {
        labels.push(item.label)
      }
      return labels
    },

    isEachFacetOpen(aggField, aggList) {
      let filtersFlag = false
      for (const obj of this.filters) {
        if (obj.label === aggField) {
          filtersFlag = true
          break
        }
      }

      /*

      //
      const key = 'each_facet_open_' + this.baseUrl
      let map = {}
      if (Object.prototype.hasOwnProperty.call(sessionStorage, key)) {
        map = JSON.parse(sessionStorage.getItem(key))
      }

      */

      //

      return (
        aggList.open || this.getMinusValues(aggField).length > 0 || filtersFlag
        // || map[aggField]
      )
    },

    saveEachFacetOpen(aggField, value) {
      const key = 'each_facet_open_' + this.baseUrl

      let map = {}
      if (Object.prototype.hasOwnProperty.call(sessionStorage, key)) {
        map = JSON.parse(sessionStorage.getItem(key))
      }

      map[aggField] = !value

      sessionStorage.setItem(key, JSON.stringify(map))
    },
  },

  head() {
    return {
      title: this.$t(this.title),
    }
  },
}
</script>
<style>
mark {
  background-color: #ffc168;
}
</style>
