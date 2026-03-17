export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const indexUrl = new URL("/index.html", url.origin);

    return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
  },
};