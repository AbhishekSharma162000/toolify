export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // always return index.html no matter what
    return env.ASSETS.fetch(
      new Request(url.origin + "/index.html", request)
    );
  },
};