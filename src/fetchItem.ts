export async function fetchItem(
  request: Request<unknown, IncomingRequestCfProperties<unknown>>,
  env: Env
) {
  const url = new URL(request.url);
  const fetchAll = url.searchParams.get("all");
  const fetchLimit = url.searchParams.get("limit");

  // Validate input
  if (!fetchAll || !fetchLimit) {
    return new Response("Missing author or content", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const query = fetchAll
    ? `SELECT * FROM comments`
    : `SELECT * FROM comments LIMIT ${fetchLimit}`;

  const stmt = env.DB.prepare(query);
  const { results } = await stmt.all();

  return new Response(JSON.stringify({ query, results }), {
    headers: { "content-type": "text/html" },
  });
}
