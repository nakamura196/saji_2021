<template>
  <v-sheet v-if="isBc" color="grey lighten-2">
    <v-container fluid class="py-4">
      <v-breadcrumbs class="py-0" :items="items">
        <template #divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class Page extends Vue {
  @Prop({ required: true })
  items!: any

  isBc: any = process.env.bc
}
</script>
