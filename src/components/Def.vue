<script lang="ts">
import { defineComponent } from "vue";
import type { LookupResponseDef } from "@/services/yandex.dictionary";

export default defineComponent({
  props: {
    def: { type: Object as () => LookupResponseDef, required: true },
  },
});
</script>

<template>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button
        class="accordion-button"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseLookupResponse-{{offset}}"
        aria-expanded="false"
        aria-controls="collapseLookupResponse-{{offset}}"
      >
        <h5>{{ def.text }}</h5>
        <i>{{ def.pos }}({{ def.ts }})</i>
      </button>
    </h2>
    <div
      id="collapseLookupResponse-{{offset}}"
      class="accordion-collapse collapse show"
      aria-labelledby="headingOne"
      data-bs-parent="#lookupResponseDefs"
    >
      <div class="accordion-body">
        <div v-for="tr in def.tr" :key="tr.text">
          <p>
            <b>Translation:&nbsp;</b>
            <span>{{ tr.text }}</span>
          </p>

          <p v-if="tr.ex">
            <b>Examples:&nbsp;</b>
            <span v-for="ex in tr.ex" :key="ex.text">
              {{ ex.tr }} ({{ ex.tr.map((tr) => tr.text).join(", ") }})
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
