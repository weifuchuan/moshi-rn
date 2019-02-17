const base64: {
  decode(str: string): string;
  encode(str: string): string;
} = require('react-native-base64').default;

export default function genKey() {
  return base64
    .encode(
      new Date().toString() +
        new Date().getTime() +
        '' +
        Math.random() +
        'hsuwyngybetrhgfbdvhdgfejdhfr746bfhbedhyybderh6fdhrdbh'
    )
    .substring(0, 8);
}
