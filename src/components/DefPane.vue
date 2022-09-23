<script lang="ts">
import { defineComponent } from "vue";
import DefComponent from "./Def.vue";
import DefFilterComponent from "./DefFilter.vue";
import { useDefStore } from "@/stores/defs";

export default defineComponent({
  setup() {
    return { defStore: useDefStore() };
  },
  components: {
    DefFilterComponent,
    DefComponent,
  },
  computed: {
    defNotFound() {
      return (
        this.defStore.history.length != 0 &&
        this.defStore.form.phrase != "" &&
        this.defStore.queriedDefPresent &&
        this.defStore.filteredDefs.length <= 0
      );
    },
  },
});
</script>

<template>
  <def-filter-component></def-filter-component>
  <hr />
  <div id="lookupResponseDefs" class="accordion ml-3 mr-3 mt-1">
    <def-component
      v-for="(def, index) in defStore.filteredDefs"
      :key="def.id"
      :def="def"
      :index="index"
    ></def-component>
    <template v-if="defStore.history.length == 0">
      <div class="alert alert-primary" role="alert">
        Start out by typing in a word and looking it up.
      </div>
    </template>
    <template v-else-if="defNotFound">
      <div class="alert alert-danger" role="alert">No translations found.</div>
    </template>
    <template v-else-if="defStore.filteredDefs.length <= 0">
      <div class="alert alert-primary" role="alert">
        Try to look up and add the word.
      </div>
    </template>
  </div>
</template>