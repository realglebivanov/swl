<script lang="ts">
import { defineComponent } from "vue";
import { useDefStore } from "@/stores/defs";

export default defineComponent({
  setup() {
    return { defStore: useDefStore() };
  },
  mounted() {
    (this.$refs.phraseInput as HTMLElement).focus();
  },
  data() {
    return {
      languageNames: new Intl.DisplayNames(["en"], { type: "language" }),
    };
  },
});
</script>

<template>
  <div class="row ml-3 mr-3 mt-3">
    <div class="col-md-6 mt-1">
      <label for="sourceLanguage" class="form-label">Source language</label>
      <select
        v-model="defStore.form.sourceLang"
        class="form-select mb-1"
        id="sourceLanguage"
      >
        <option v-for="lang in defStore.sourceLangs" :key="lang" :value="lang">
          {{ languageNames.of(lang) }}
        </option>
      </select>
    </div>
    <div class="col-md-6 mt-1">
      <label for="targetLanguage" class="form-label">Target language</label>
      <select
        v-model="defStore.form.targetLang"
        class="form-select mb-1"
        :disabled="!defStore.form.sourceLang"
        id="targetLanguage"
      >
        <option
          v-for="lang in defStore.targetLangs[defStore.form.sourceLang]"
          :key="lang"
          :value="lang"
        >
          {{ languageNames.of(lang) }}
        </option>
      </select>
    </div>
    <div class="col-md-6 mt-1">
      <label for="phrase" class="form-label">Word or phrase to look up</label>
      <input
        v-model="defStore.form.phrase"
        type="text"
        class="form-control"
        ref="phraseInput"
        id="phrase"
        placeholder="Type a word or a phrase and press Enter"
        :disabled="!defStore.form.targetLang"
        @keypress.enter="defStore.lookup()"
      />
    </div>
    <!-- <div class="col-md-6 mt-1">
      <label for="partOfSpeech" class="form-label">Part of speech</label>
      <select
        v-model="defStore.form.partOfSpeech"
        class="form-select"
        :disabled="!defStore.form.sourceLang"
        id="partOfSpeech"
      >
        <option
          v-for="partOfSpeech in defStore.form.partsOfSpeech"
          :key="partOfSpeech"
          :value="partOfSpeech"
        >
          {{
            partOfSpeech[0].toUpperCase() + partOfSpeech.slice(1).toLowerCase()
          }}
        </option>
      </select>
    </div> -->
    <div class="btn-group mt-2" role="group">
      <button
        class="btn btn-primary"
        :disabled="!defStore.form.phrase"
        @click="defStore.lookup()"
      >
        Look up and add
      </button>
    </div>
  </div>
</template>