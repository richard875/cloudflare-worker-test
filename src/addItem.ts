type AddItem = {
  author: string;
  content: string;
};

export async function addItem(
  request: Request<unknown, IncomingRequestCfProperties<unknown>>,
  env: Env
) {
  let requestBody: AddItem;
  try {
    requestBody = await request.json();
  } catch (err) {
    return new Response("Invalid JSON body", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const { author, content } = requestBody as AddItem;

  // Validate input
  if (!author || !content) {
    return new Response("Missing author or content", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const query = `
    INSERT INTO comments (author, content)
    VALUES (?, ?)
  `;

  try {
    const stmt = env.DB.prepare(query);
    await stmt.bind(author, content).run(); // Safely insert using parameters
  } catch (err) {
    return new Response("Database error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  const jsonResponse = {
    message: "Comment added successfully",
    author: author,
    content: content,
  };

  return new Response(JSON.stringify(jsonResponse), {
    headers: { "Content-Type": "application/json" },
    status: 201,
  });
}
