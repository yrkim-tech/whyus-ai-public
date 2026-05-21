export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = body.apiKey || process.env.ANTHROPIC_KEY;

    if (!apiKey) {
      return Response.json({ error: { message: "API 키가 없습니다." } }, { status: 400 });
    }

    const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      if (data.error) {
        setResult("API 오류: " + data.error.message + "\nAPI 키를 다시 확인해 주세요.");
      } else {
        setResult(data.content?.map(b => b.text || "").join("") || "생성에 실패했습니다.");
      }