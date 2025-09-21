// ✅ API Routes configuration
import { config } from "./config";

export const apiRoutes = {
  houses: `${config.backendUrl}/api/houses`,
  favorites: `${config.backendUrl}/api/favorites`,
  messages: `${config.backendUrl}/api/messages`,
  users: `${config.backendUrl}/api/users`,
  upload: `${config.backendUrl}/api/upload`,
};

export const clientRoutes = {
  home: "/",
  houses: "/houses",
  favorites: "/favorites",
  messages: "/messages",
  userHouses: "/userHouses",
  signIn: "/signIn",
};
