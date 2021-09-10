<template>
  <v-footer :dark="true" class="mt-5">
    <v-container>
      <p class="text-center my-5">
        <small>
          本データベースはJSPS科研費<a
            class="mx-1"
            href="https://kaken.nii.ac.jp/ja/grant/KAKENHI-PROJECT-18K00073/"
            >18K00073</a
          >、<a
            class="mx-1"
            href="https://kaken.nii.ac.jp/ja/grant/KAKENHI-PROJECT-21H04345/"
            >21H04345</a
          >の助成による成果の一部です。
        </small>
      </p>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Footer extends Vue {}
</script>
