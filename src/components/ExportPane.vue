<script lang="ts">
import { defineComponent } from "vue";
import { useDefStore } from "@/stores/defs";
import { useAnkiStore } from "@/stores/anki";

export default defineComponent({
  setup() {
    return { defStore: useDefStore(), ankiStore: useAnkiStore() };
  },
  mounted() {
    this.ankiStore.fetchDecks();
  },
  methods: {
    exportToFile() { },
    exportToAnki() { },
  },
});
</script>

<template>
  <div class="row mt-3">
    <div class="col-md-12">
      <div class="input-group mb-3">
        <select v-model="ankiStore.form.ankiDeck" class="form-select" :disabled="ankiStore.decks.length == 0">
          <option selected>Choose an anki deck</option>
          <option v-for="ankiDeck in ankiStore.decks" :key="ankiDeck" :value="ankiDeck">
            {{ ankiDeck }}
          </option>
        </select>
        <input v-model="ankiStore.form.newAnkiDeck" type="text" class="form-control"
          placeholder="Type in a new anki deck name" />
        <button class="btn btn-outline-success" type="button" :disabled="!ankiStore.form.newAnkiDeck"
          @click="ankiStore.createDeck()">
          Create
        </button>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="btn-group col-md-12" role="group">
      <button class="btn btn-primary" @click="ankiStore.exportAll()" :disabled="ankiStore.decks.length == 0">
        Export to anki
      </button>
      <button class="btn btn-secondary" @click="defStore.exportToFile()">
        Export to a file
      </button>
    </div>
  </div>
</template>