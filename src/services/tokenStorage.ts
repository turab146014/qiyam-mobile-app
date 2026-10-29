import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "qiyam_access_token";
const REFRESH_KEY = "qiyam_refresh_token";

export const tokenStorage = {
  getAccess: () => SecureStore.getItemAsync(ACCESS_KEY),

  getRefresh: () => SecureStore.getItemAsync(REFRESH_KEY),

  save: async (access: string, refresh: string) => {
    await SecureStore.setItemAsync(ACCESS_KEY, access);
    await SecureStore.setItemAsync(REFRESH_KEY, refresh);
  },

  clear: async () => {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },
};