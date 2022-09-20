<script lang="ts">
import { defineComponent } from "vue";
import { useDefStore } from "@/stores/defs";
import type { Def } from "@/stores/defs";

export default defineComponent({
  setup: () => ({ defStore: useDefStore() }),
  props: {
    def: { type: Object as () => Def, required: true },
    index: { type: Number, required: true },
  },
  methods: {
    isExpanded() {
      return this.index == 0;
    },
  },
});
</script>

<template>
  <div class="accordion-item">
    <h2 class="accordion-header" :id="`collapseLookupResponseHeader-${index}`">
      <button
        :class="[isExpanded() ? '' : 'collapsed', 'accordion-button']"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#collapseLookupResponse-${index}`"
        :aria-expanded="isExpanded()"
        :aria-controls="`collapseLookupResponse-${index}`"
      >
        <h5>
          <b class="badge bg-danger" @click="defStore.remove(def)">-</b>
          {{ def.text }}(<i>{{ def.pos }}, [{{ def.ts }}]</i>)
        </h5>
      </button>
    </h2>
    <div
      :id="`collapseLookupResponse-${index}`"
      :class="[isExpanded() ? 'show' : '', 'accordion-collapse', 'collapse']"
      :aria-labelledby="`collapseLookupResponseHeader-${index}`"
      data-bs-parent="#lookupResponseDefs"
    >
      <div class="accordion-body">
        <ul>
          <li v-for="tr in def.tr" :key="tr.text">
            <b>{{ tr.text }}</b>
            <template v-if="tr.ex">
              <span v-for="ex in tr.ex" :key="ex.text" class="mr-1">
                <i>{{ ex.text }}:</i>
                {{ ex.tr.map((tr) => tr.text).join(", ") }}
              </span>
            </template>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
