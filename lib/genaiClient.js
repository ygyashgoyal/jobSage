import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generates a contextual Gemini response limited to profile/resume analysis.
 * @param {string} userInput - The user's question/input.
 * @param {object} analysisData - Full analysis object including summary, job_target, etc.
 * @returns {Promise<string>} - The AI's response.
 */
export async function getAIResponse(userInput, analysisData = {}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const {
    job_target = 'N/A',
    resume_text = 'Not provided.',
    summary = [],
    ...rest
  } = analysisData;

  const formattedSummary = summary
    .map(({ title, content }) => `## ${title}\n${content}`)
    .join('\n\n');

  const prompt = `
You are a smart assistant that helps users based on their resume/profile analysis.

Target Job Role: ${job_target}

Resume Text:
${resume_text}

Analysis Summary:
${formattedSummary}

Additional Metadata:
${JSON.stringify(rest, null, 2)}

Your task:
Only answer questions related to the resume or the analysis. If the user asks something unrelated (e.g., movies, politics, random coding), politely say you're only here to help improve their professional profile.

User: ${userInput}
Assistant:
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
