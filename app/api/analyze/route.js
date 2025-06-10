import { NextResponse } from 'next/server';
import { getAIResponse } from '../../../lib/genaiClient';

export async function POST(request) {
  try {
    const { resumeText, dreamJob } = await request.json();

    if (!resumeText || !dreamJob) {
      return NextResponse.json({ error: 'Missing resumeText or dreamJob' }, { status: 400 });
    }

    const prompt = `
You are an expert career advisor. Analyze this resume for the following dream job: "${dreamJob}".

Resume content:
${resumeText}

Please provide:
1. Skills that match the job.
2. Skills missing for the job.
3. DSA topics to improve.
4. Recommendation YouTube video links or courses to learn these skills (Ex - Striver's SDE Sheet).
5. The final score in bold based on the above criteria for the dream job. And don't say you can't decide the score directly.
Format your answer clearly.

`;

    const aiResponse = await getAIResponse(prompt);

    return NextResponse.json({ analysis: aiResponse });

  } catch (error) {
    console.error('Error in AI analysis API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
