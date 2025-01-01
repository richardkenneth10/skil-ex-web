import {
  FaExchangeAlt,
  FaHome,
  FaQuestion,
  FaSignOutAlt,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import logout from "./logout";

export default class Constants {
  static apiBaseUrl = "https://localhost:3000";
  static accessTokenKey = "accessToken";
  static refreshTokenKey = "refreshToken";
  static navItems = [
    { title: "Home", icon: FaHome },
    { title: "Rooms", icon: FaHouse },
    { title: "Exchanges", icon: FaExchangeAlt },
    { title: "Profile", icon: FaUser },
  ];
  static drawerItems = {
    top: [{ title: "Premium", icon: FaStar, pathUrlOrCB: "" }],
    bottom: [
      { title: "FAQs", icon: FaQuestion, pathUrlOrCB: "" },
      { title: "Logout", icon: FaSignOutAlt, pathUrlOrCB: logout },
    ],
  };
  static userKey = "user";
  static userAgentKey = "userAgent";
}
