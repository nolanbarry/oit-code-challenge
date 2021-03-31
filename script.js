const conversion = [
  { r: 'i', d: 1 },
  { r: 'v', d: 5 },
  { r: 'x', d: 10 },
  { r: 'l', d: 50 },
  { r: 'c', d: 100 },
  { r: 'd', d: 500 },
  { r: 'm', d: 1000 }
]
let app = new Vue({
  el: '#app',
  data: {
    from: "",
    to: "",
    fromInput: "",
    toInput: "",
  },
  methods: {
    toRomanNumeral(num) {
      if (num == 0) return "";
      // determine highest divisible power of NUM (only values of order 10^n)
      let power = {r: '', d: '0'};
      for (let i = 0; i < conversion.length; i += 2) {
        if ((num / conversion[i].d) >= 1) power = conversion[i];
      }
      // determine how many times POWER can divide into NUM
      let count = Math.floor(num / power.d);
      let result = "";
      // determine if roman numeral simply repeats or uses subtraction rule
      // since m is the highest value, it will just repeat
      if (count == 9 && power.r != 'm') {               // i.e. 9 = IX (10 - 1)
        result = power.r + this.neighborBy(power, 2).r;
      } else if (count == 4 && power.r != 'm') {  // i.e. 4 = IV (5 - 1)
        result = power.r + this.neighborBy(power, 1).r;
      } else {                                          // i.e III (3) or VI (6)
        if (count >= 5 && power.r != 'm') // replaces first 5 numerals with 5 power if applicable
          result = this.neighborBy(power, 1).r;
        result += power.r.repeat(count % 5);
      }
      return result + this.toRomanNumeral(num - count * power.d);
    },
    fromRomanNumeral(numerals) {
      if (numerals == "") return 0;
      if (numerals.length == 1) return this.value(numerals[0]);
      // read first two characters
      let first = this.value(numerals[0]);
      let second = this.value(numerals[1]);
      // if second is larger, consume both
      if (second > first) return second-first + this.fromRomanNumeral(numerals.substr(2));
      // otherwise consume just the one and call again
      else return first + this.fromRomanNumeral(numerals.substr(1));
    },
    // HELPER FUNCTIONS
    // gets value of single roman numeral
    value(numeral) {
      return conversion.find(entry => entry.r == numeral.toLowerCase()).d;
    },
    // takes CONVERSION object, finds CONVERSION object N indices away
    neighborBy(convObj, n) {
      return conversion[conversion.findIndex(x => x.r == convObj.r) + n];
    },
    // functions for buttons
    convertFrom() {
      // only checks to make sure characters are roman numerals
      // otherwise assumers order is correct
      let valid = true;
      Array.from(this.fromInput).forEach(char => {
        if (conversion.findIndex(value => value.r == char.toLowerCase()) == -1) {
          valid = false;
        }
      });
      if (valid) this.from = this.fromRomanNumeral(this.fromInput);
      else this.from = "";
    },
    convertTo() {
      if (parseInt(this.toInput) + "" == this.toInput)
        this.to = this.toRomanNumeral(this.toInput).toUpperCase();
      else this.to = "";
    }
  }
})
