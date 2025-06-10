import { NextResponse } from 'next/server';
import { getAIResponse } from '../../../lib/genaiClient';

export async function POST(request) {
  try {
    const { analysis } = await request.json();

    if (!analysis) {
      return NextResponse.json({ error: 'Missing analysis data' }, { status: 400 });
    }

    const analysisStr = JSON.stringify(analysis, null, 2).slice(0, 8000); // to avoid token limits

    const prompt = `
You are a helpful AI career assistant.

Summarize the following analysis in **clear bullet points** (max 6–8). The summary should:
- Be **concise**, professional, and **insightful**.
- Highlight **key strengths**, **missing skills**, **improvement suggestions** and **Where to start**.
- Avoid repeating raw content from the JSON.
- Maintain a helpful and constructive tone.
- Numbers are important.
- Don't summarize to much, detailed explanations matters. Ex - Which topics in Leetcode based on Leetcode Analysis should the user focus more on?

--- BEGIN ANALYSIS ---
${analysisStr}
--- END ANALYSIS ---
`;

    const aiResponse = await getAIResponse(prompt);
    const summary = aiResponse?.trim() || '• Summary not available at this time.';

    return NextResponse.json({
      summary,
      formatted_analysis: analysis, // keep original structure for frontend rendering
    });
  } catch (error) {
    console.error('Error in summarizing analysis:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
