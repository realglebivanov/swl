<script lang="ts">
import { defineComponent } from "vue";
import { useDefStore } from "@/stores/defs";
import { useAnkiStore } from "@/stores/anki";

export default defineComponent({
  setup() {
    return { defStore: useDefStore(), ankiStore: useAnkiStore() };
  },
  mounted() {
    this.ankiStore.createDefaultModels();
    this.ankiStore.fetchDecks();
  }
});
</script>

<template>
  <div class="row mt-2">
    <div class="col-md-12">
      <h5 v-if="ankiStore.decks.length > 0">
        Choose an anki deck
        <button class="btn btn-sm btn-danger" type="button" :disabled="!ankiStore.form.ankiDeck"
          @click="ankiStore.deleteDeck()">
          Delete selected deck
        </button>
      </h5>
      <div class="form-check" v-for="ankiDeck in ankiStore.decks" :key="ankiDeck" v-if="ankiStore.decks.length > 0">
        <input class="form-check-input" name="ankiDeck" type="radio" :id="`deck-${ankiDeck}`"
          v-model="ankiStore.form.ankiDeck" :value="ankiDeck">
        <label class="form-check-label" :for="`deck-${ankiDeck}`">
          {{ ankiDeck }}
        </label>
      </div>
      <div class="alert alert-primary" role="alert" v-else>
        Try to create a new anki deck.
      </div>
      <div class="input-group mb-3">
        <input v-model="ankiStore.form.newAnkiDeck" type="text" class="form-control"
          placeholder="Type in a new anki deck name" @keypress.enter="ankiStore.createDeck()" />
        <button class="btn btn-outline-success" type="button" :disabled="!ankiStore.form.newAnkiDeck"
          @click="ankiStore.createDeck()">
          Create
        </button>
      </div>
      <h5 class="mt-2">
        Choose created card type
      </h5>
      <div class="form-check" v-for="modelName in ankiStore.form.getDefaultModelNames()" :key="modelName.value">
        <input class="form-check-input" name="ankiModel" type="radio" :id="`deck-modelname-${modelName.value}`"
          v-model="ankiStore.form.ankiModel" :value="modelName.value">
        <label class="form-check-label" :for="`deck-modelname-${modelName.value}`">
          {{ modelName.description }}
        </label>
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