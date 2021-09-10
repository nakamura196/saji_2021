<template>
  <div>
    <BMenu :items="bh"></BMenu>
    <v-container class="my-5">
      <h2 class="mb-5">{{ $t('category') + '：' + $t(config.label) }}</h2>

      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>{{ $t('name') }}</th>
              <!-- <th></th> -->
            </tr>
          </thead>
          <tbody>
            <template v-for="(agg, key) in aggsConfig">
              <tr v-if="!agg.hide" :key="key">
                <td>
                  <nuxt-link
                    :to="
                      localePath({
                        name: 'category-slug-id',
                        params: { slug, id: key },
                      })
                    "
                  >
                    {{ agg.label }}
                  </nuxt-link>
                </td>

                <!--
                    <td>
                      {{100}} {{$t("results")}}
                    </td>
                    -->
              </tr>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </div>
</template>

<script>
import BMenu from '~/components/BMenu.vue'

export default {
  components: {
    BMenu,
  },
  data() {
    return {
      isBc: process.env.bc,

      slug: this.$route.params.slug || 'default',
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
    aggsConfig: {
      get() {
        return this.config.aggs
      },
      set() {},
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
            text: this.$t('category'),
            to: this.localePath({ name: 'category' }),
            exact: true,
          },
          {
            text: this.$t(this.config.label),
          },
        ]
      },
    },
  },

  head() {
    return {
      title: this.$t('category') + '：' + this.$t(this.config.label),
    }
  },
}
</script>
