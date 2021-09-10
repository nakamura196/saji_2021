<template>
  <span>
    <template v-if="value">
      {{ value }}
    </template>
    <template v-else>
      <span style="color: #4caf50;">
        {{ $t('none') }}
      </span>
    </template>
  </span>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ShareButtons extends Vue {
  @Prop({ required: true })
  value!: string
}
</script>
