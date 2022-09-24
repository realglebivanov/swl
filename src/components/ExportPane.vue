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
  }
});
</script>

<template>
  <div class="row mt-3">
    <div class="col-md-12" v-if="ankiStore.decks.length > 0">
      <h5>
        Choose an anki deck
        <button class="btn btn-sm btn-danger" type="button" :disabled="!ankiStore.form.ankiDeck"
          @click="ankiStore.deleteDeck()">
          Delete selected deck
        </button>
      </h5>
      <div class="form-check" v-for="ankiDeck in ankiStore.decks" :key="ankiDeck">
        <input class="form-check-input" name="ankiDeck" type="radio" :id="`deck-${ankiDeck}`"
          v-model="ankiStore.form.ankiDeck" :value="ankiDeck">
        <label class="form-check-label" :for="`deck-${ankiDeck}`">
          {{ ankiDeck }}
        </label>
      </div>
    </div>
    <div v-else>
      <div class="alert alert-primary" role="alert">
        Try to create a new anki deck.
      </div>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-md-12">
      <div class="input-group mb-3">
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
      <button class="btn btn-primary" @click="ankiStore.exportAll()" :disabled="ankiStore.form.noDeckSelected()">
        Export to anki
      </button>
      <button class="btn btn-secondary" @click="defStore.exportToFile()" :disabled="!defStore.defs.length">
        Export to a file
      </button>
    </div>
  </div>
</template>