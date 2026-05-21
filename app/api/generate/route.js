export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = body.apiKey || process.env.ANTHROPIC_KEY;

    if (!apiKey) {
      return Response.json({ error: { message: "API 키가 없습니다." } }, { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 3000,
        messages: body.messages,
      }),
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }
}