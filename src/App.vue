<script lang="ts">
import { defineComponent } from "vue";
import { useDefStore } from "./stores/defs";
import DefComponent from "./components/Def.vue";

export default defineComponent({
  setup() {
    return { defStore: useDefStore() };
  },
  mounted() {
    this.defStore.fetchLangs();
  },
  components: {
    Def: DefComponent,
  },
  data() {
    return {
      sourceLanguage: "en",
      targetLanguage: "ru",
      phrase: "",
    };
  },
});
</script>

<template>
  <main class="container">
    <div v-if="defStore.sourceLangs.length > 0" class="row ml-3 mr-3 mt-3">
      <div class="col-md-6 mt-1">
        <label for="sourceLanguage" class="form-label">Source language</label>
        <select
          v-model="sourceLanguage"
          class="form-select mb-1"
          id="sourceLanguage"
        >
          <option v-for="lang in defStore.sourceLangs" :key="lang">
            {{ lang }}
          </option>
        </select>
      </div>
      <div class="col-md-6 mt-1">
        <label for="targetLanguage" class="form-label">Target language</label>
        <select
          v-model="targetLanguage"
          class="form-select mb-1"
          :disabled="!sourceLanguage"
          id="targetLanguage"
        >
          <option
            v-for="lang in defStore.targetLangs[sourceLanguage]"
            :key="lang"
          >
            {{ lang }}
          </option>
        </select>
      </div>
      <div class="col-md-12 mt-1">
        <label for="word" class="form-label">Word or phrase to look up</label>
        <input
          v-model="phrase"
          type="text"
          class="form-control"
          id="word"
          placeholder="Enter a word or a phrase"
          :disabled="!targetLanguage"
          @keypress.enter="
            defStore.lookup(sourceLanguage, targetLanguage, phrase)
          "
        />
      </div>
      <div class="btn-group mt-2" role="group">
        <button
          class="btn btn-primary"
          :disabled="!phrase"
          @click="defStore.lookup(sourceLanguage, targetLanguage, phrase)"
        >
          Look up and add
        </button>
        <button class="btn btn-secondary" @click="defStore.exportAll()">
          Export all
        </button>
        <button class="btn btn-danger" @click="defStore.removeAll()">
          Remove all
        </button>
      </div>
    </div>
    <div id="lookupResponseDefs" class="accordion ml-3 mr-3 mt-1">
      <Def
        v-for="(def, index) in defStore.allDefs"
        :key="def.id"
        :def="def"
        :index="index"
      ></Def>
    </div>
  </main>
</template>
