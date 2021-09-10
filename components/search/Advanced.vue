<template>
  <div class="grey lighten-5 pa-5">
    <v-row v-for="(config, key) in configs" :key="key" dense>
      <v-col cols="3">
        <v-subheader>{{ config.label }}</v-subheader>
      </v-col>
      <v-col cols="9">
        <template v-if="config.type === 'select'">
          <v-select
            v-model="config.value"
            :items="config.values"
            filled
            rounded
            dense
            multiple
            hide-details
          ></v-select>
        </template>
        <template v-else>
          <v-text-field
            v-model="config.value"
            hide-details
            filled
            rounded
            dense
            @click:append="search"
            @keydown.enter="trigger"
          ></v-text-field>
        </template>
      </v-col>
    </v-row>

    <div class="text-center mt-2">
      <v-btn rounded depressed color="grey lighten-2" @click="reset()">
        {{ $t('reset') }}
      </v-btn>
      <v-btn rounded depressed color="primary" @click="search()">
        {{ $t('search') }}
      </v-btn>
    </div>
  </div>
  <!-- class="mr-2" dark -->
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'

@Component({})
export default class FullTextSearch extends Vue {
  @Watch('$route')
  watchRoute() {
    this.updateQuery()
    /*
    if (query['main[query]']) {
      this.q = query['main[query]']
    }
    */
  }

  updateQuery() {
    const query = this.$route.query

    const configs = this.configs

    const queryMap: any = {}

    for (const queryField in query) {
      if (queryField.includes('[advanced]')) {
        const key = queryField.split('[')[2].split(']')[0]

        if (!queryMap[key]) {
          queryMap[key] = []
        }

        let values = query[queryField]

        if (typeof values === 'string') {
          values = [values]
        }

        for (const v of values) {
          queryMap[key].push(v)
        }
      }
    }

    for (const option of configs) {
      if (queryMap[option.key]) {
        option.value = queryMap[option.key]
      }
    }

    this.configs = configs
  }

  configs: any = process.env.advanced

  created() {
    this.updateQuery()
  }

  trigger(event: any) {
    // 日本語入力中のEnterキー操作は無効にする
    if (event.keyCode !== 13) return
    this.search()
  }

  search() {
    const query = JSON.parse(JSON.stringify(this.$route.query))

    for (const config of this.configs) {
      const field = config.key

      for (const queryField in query) {
        if (queryField.includes('[advanced][' + field + ']')) {
          delete query[queryField]
        }
      }

      const value = config.value

      if (value === '') {
        continue
      }

      console.log(field, value)

      let values = value

      if (typeof values === 'string') {
        values = [values]
      }

      for (let i = 0; i < values.length; i++) {
        query['main[advanced][' + field + '][' + i + ']'] = values[i]
      }
    }

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      })
    )
  }

  reset() {
    for (const config of this.configs) {
      config.value = ''
    }
  }
}
</script>
