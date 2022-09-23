<script lang="ts">
import { defineComponent } from "vue";
import { useDefStore } from "./stores/defs";

import DefPaneComponent from "./components/DefPane.vue";
import ExportPaneComponent from "./components/ExportPane.vue";

export default defineComponent({
  setup() {
    return { defStore: useDefStore() };
  },
  mounted() {
    this.defStore.fetchLangs();
  },
  components: {
    DefPaneComponent,
    ExportPaneComponent,
  },
});
</script>

<template>
  <main class="container">
    <div class="row mt-3">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home"
            type="button"
            role="tab"
            aria-controls="home"
            aria-selected="true"
          >
            Home
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile"
            type="button"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
          >
            Export
          </button>
        </li>
      </ul>

      <div class="tab-content">
        <div
          class="tab-pane active"
          id="home"
          role="tabpanel"
          aria-labelledby="home-tab"
        >
          <def-pane-component
            v-if="defStore.sourceLangs.length > 0"
          ></def-pane-component>
        </div>
        <div
          class="tab-pane"
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <export-pane-component></export-pane-component>
        </div>
      </div>
    </div>
  </main>
</template>
