<template>
  <div>
    <v-row>
      <v-col v-for="item in items" :key="item.objectID" cols="12" sm="3">
        <v-card flat no-body class="mb-4">
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
          <div class="pa-4">
            <nuxt-link
              :to="
                localePath({
                  name: 'item-id',
                  params: { id: item.objectID },
                })
              "
            >
              <h4>{{ item.label }}</h4>
            </nuxt-link>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component /*, Watch */ } from 'nuxt-property-decorator'

@Component({})
export default class FullTextSearch extends Vue {
  @Prop({})
  items!: any[]
}
</script>
