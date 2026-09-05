// Здесь только публичные настройки. Никогда не вставляй Supabase secret key, legacy service_role, API secret или пароль.
window.AIRC_RUNTIME = {
  dataMode: "local", // "local" или "supabase"
  apiBaseUrl: ["localhost", "127.0.0.1"].includes(location.hostname)
    ? "http://127.0.0.1:3000"
    : "https://api.artdeco-vl.ru",
  workspaceId: "airc-demo",
  supabase: {
    url: "",
    publishableKey: "",
  },
};
