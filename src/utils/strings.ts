export default class Strings {
  static capitalizeFirst = (str: string) =>
    !str ? str : `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
