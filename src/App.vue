<script lang="ts">
import { defineComponent } from "vue";
import type { Dictionary } from "./dictionary";
import type { LookupResponseDef } from "@/services/yandex.dictionary";
import { reject } from "ramda";
import DefComponent from "./components/Def.vue";

export default defineComponent({
  created() {
    this.$yandexDictionary.getLangs().then((targetLangs) => {
      this.targetLangs = targetLangs;
      this.sourceLangs = Object.keys(this.targetLangs);
    });
  },
  methods: {
    lookup() {
      this.$yandexDictionary
        .lookup(this.sourceLanguage, this.targetLanguage, this.phrase)
        .then(
          (lookupResponse) =>
            (this.lookupResponseDefs = this.lookupResponseDefs.concat(
              lookupResponse.def
            ))
        );
    },
    export() {
      console.log(
        reject(
          (def: LookupResponseDef) => def.tr.length == 0,
          this.lookupResponseDefs
        )
      );
    },
    getDef(offset: number) {
      return this.lookupResponseDefs[this.lookupResponseDefs.length - offset];
    },
  },
  components: {
    Def: DefComponent,
  },
  data() {
    return {
      targetLangs: {} as Dictionary<string[]>,
      sourceLangs: [] as string[],
      sourceLanguage: "en",
      targetLanguage: "ru",
      phrase: "",
      lookupResponseDefs: [] as LookupResponseDef[],
    };
  },
});
</script>

<template>
  <main class="container">
    <div v-if="sourceLangs.length > 0" class="row ml-3 mr-3 mt-3">
      <div class="col-md-6 mt-1">
        <label for="sourceLanguage" class="form-label">Source language</label>
        <select
          v-model="sourceLanguage"
          class="form-select mb-1"
          id="sourceLanguage"
        >
          <option v-for="lang in sourceLangs" :key="lang">{{ lang }}</option>
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
          <option v-for="lang in targetLangs[sourceLanguage]" :key="lang">
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
          @keypress.enter="lookup()"
        />
      </div>
      <div class="col-md-12 mt-1">
        <button class="btn btn-primary" :disabled="!phrase" @click="lookup()">
          Look up and add
        </button>
      </div>
    </div>
    <div id="lookupResponseDefs" class="accordion ml-3 mr-3 mt-1">
      <Def
        v-for="offset in lookupResponseDefs.length"
        :key="offset"
        :def="getDef(offset)"
      ></Def>
    </div>
  </main>
</template>
