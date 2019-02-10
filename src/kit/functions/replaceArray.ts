export default function replaceArray<T>(src: T[], dst: T[]) {
  src.splice(0, src.length, ...dst);
}
