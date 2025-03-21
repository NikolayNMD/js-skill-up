/* Create a function that takes 2 integers in form of a string as an input, and outputs the sum (also as a string):

Example: (Input1, Input2 -->Output)

"4",  "5" --> "9"
"34", "5" --> "39"
"", "" --> "0"
"2", "" --> "2"
"-5", "3" --> "-2" */

function sumStr(a, b) {
  if (a === "" && b === "") {
    return "0";
  }
  if (a === "") {
    a = 0;
  } else if (b === "") {
    b = 0;
  }
  let numberToStringSum = parseInt(a) + parseInt(b);
  return numberToStringSum.toString();
}

console.log(sumStr("34", "5"), "39");
