export async function fetchItem(
  request: Request<unknown, IncomingRequestCfProperties<unknown>>,
  env: Env
) {
  const url = new URL(request.url);
  const all = url.searchParams.get("all");
  const limit = url.searchParams.get("limit");

  // Validate input
  if (!all || !limit) {
    return new Response("Missing author or content", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const fetchLimit = limit ? parseInt(limit, 10) : null;
  const fetchAll = all === "true" ? true : all === "false" ? false : null;

  const query = fetchAll
    ? `SELECT * FROM comments`
    : `SELECT * FROM comments LIMIT ${fetchLimit}`;

  const stmt = env.DB.prepare(query);
  const { results } = await stmt.all();

  return new Response(JSON.stringify({ query, results }), {
    headers: { "Content-Type": "application/json" },
  });
}
