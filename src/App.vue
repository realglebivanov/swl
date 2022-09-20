<script lang="ts">
import { defineComponent } from "vue";
import { useDefStore } from "./stores/defs";
import DefComponent from "./components/Def.vue";
import { AppForm } from "./app.form";

export default defineComponent({
  setup() {
    return { defStore: useDefStore() };
  },
  mounted() {
    this.defStore.fetchLangs().then(() => {
      (this.$refs.phraseInput as HTMLElement).focus();
    });
  },
  components: {
    DefComponent,
  },
  data() {
    return {
      form: new AppForm(),
    };
  },
  methods: {
    lookup() {
      this.defStore.lookup(Object.assign(this.form, {}));
    },
    filteredDefs() {
      return this.defStore.filterDefs(this.form);
    },
    notFound() {
      return (
        this.defStore.formInHistory(this.form) &&
        this.filteredDefs().length <= 0
      );
    },
  },
});
</script>

<template>
  <main class="container" v-if="defStore.sourceLangs.length > 0">
    <div class="row ml-3 mr-3 mt-3">
      <div class="col-md-6 mt-1">
        <label for="sourceLanguage" class="form-label">Source language</label>
        <select
          v-model="form.sourceLang"
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
          v-model="form.targetLang"
          class="form-select mb-1"
          :disabled="!form.sourceLang"
          id="targetLanguage"
        >
          <option
            v-for="lang in defStore.targetLangs[form.sourceLang]"
            :key="lang"
          >
            {{ lang }}
          </option>
        </select>
      </div>
      <div class="col-md-6 mt-1">
        <label for="phrase" class="form-label">Word or phrase to look up</label>
        <input
          v-model="form.phrase"
          type="text"
          class="form-control"
          ref="phraseInput"
          id="phrase"
          placeholder="Type a word or a phrase and press Enter"
          :disabled="!form.targetLang"
          @keypress.enter="lookup()"
        />
      </div>
      <div class="col-md-6 mt-1">
        <label for="partOfSpeech" class="form-label">Part of speech</label>
        <select
          v-model="form.partOfSpeech"
          class="form-select"
          :disabled="!form.sourceLang"
          id="partOfSpeech"
        >
          <option
            v-for="partOfSpeech in form.partsOfSpeech"
            :key="partOfSpeech"
          >
            {{ partOfSpeech }}
          </option>
        </select>
      </div>
      <div class="btn-group mt-2" role="group">
        <button
          class="btn btn-primary"
          :disabled="!form.phrase"
          @click="lookup()"
        >
          Look up and add
        </button>
        <button class="btn btn-secondary" @click="defStore.exportAll()">
          Export all
        </button>
      </div>
    </div>
    <div id="lookupResponseDefs" class="accordion ml-3 mr-3 mt-1">
      <def-component
        v-for="(def, index) in filteredDefs()"
        :key="def.id"
        :def="def"
        :index="index"
      ></def-component>
      <template v-if="notFound()">
        <div class="alert alert-danger" role="alert">
          No translations found.
        </div>
      </template>
      <template v-else-if="filteredDefs().length <= 0">
        <div class="alert alert-primary" role="alert">
          Try to look up and add the word.
        </div>
      </template>
    </div>
  </main>
</template>
