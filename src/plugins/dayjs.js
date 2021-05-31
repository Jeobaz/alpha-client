import Vue from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

Object.defineProperties(Vue.prototype, {
  $date: {
    get() {
      return dayjs;
    },
  },
});
