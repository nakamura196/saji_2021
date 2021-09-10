<template>
  <div>
    <BMenu :items="bh"></BMenu>
    <v-container class="my-5">
      <h2 class="mb-5">{{ title }}</h2>

      <ul class="my-5">
        <li v-for="(item, key) in menu" :key="key" class="mb-2">
          <nuxt-link :to="localePath(item.to)">{{ item.label }}</nuxt-link>
        </li>
      </ul>
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
    return this.$t('category')
  }

  head() {
    return {
      title: this.title,
    }
  }

  get bh(): any {
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

  menu: any[] = [
    {
      label: '書名目録',
      to: {
        name: 'category-slug',
        params: {
          slug: 'default',
        },
      },
    },
    {
      label: '詳細目録',
      to: {
        name: 'category-slug',
        params: {
          slug: 'advanced',
        },
      },
    },
  ]
}
</script>
