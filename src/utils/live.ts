import { DeviceTag } from "@/components/live/live-setup";

export default class Live {
  static formatTags = (tags: DeviceTag[]) => {
    let text = "";
    for (let i = 0; i < tags.length; i++) {
      if (i == tags.length - 1 && i != 0) {
        text += " and";
      }
      text += `${i == 0 ? "S" : " s"}ystem ${tags[i]}`;
    }
    return text;
  };
}
