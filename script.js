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
    input: "",
    result: ""
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
        if (count >= 5 && power.r != 'm') {// replaces first 5 numerals with 5 power if applicable
          result = this.neighborBy(power, 1).r;
          result += power.r.repeat(count % 5);
        } else {
          result += power.r.repeat(count);
        }
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
    // button function
    convert() {
      if (this.input == "") {
        this.result = "";
        return;
      }
      // checks to see if input contains roman numerals
      let validNumerals = ['i', 'v', 'x', 'l', 'c', 'd', 'm']
      if (Array.from(this.input).reduce((current, char) => validNumerals.includes(char.toLowerCase()) ? current : false, true)) {
        this.result = this.fromRomanNumeral(this.input);
      } else if (parseInt(this.input) + "" == this.input) { // checks if input contains an integer
        this.result = this.toRomanNumeral(this.input).toUpperCase();
      } else { // otherwise input is invalid
        this.result = "";
      }
      if (this.result.length > 30) {
        console.log(this.result);
        this.result = "Input too large";
      }
    }
  }
})
