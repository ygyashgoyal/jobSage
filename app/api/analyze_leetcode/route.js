import { getAIResponse } from '../../../lib/genaiClient'; 

export async function POST(req) {
  const { username } = await req.json();

  if (!username) {
    return new Response(JSON.stringify({ error: "Username is required" }), {
      status: 400,
    });
  }

  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const json = await response.json();

    if (!json?.data?.matchedUser) {
      return new Response(JSON.stringify({ error: "User not found or data unavailable" }), {
        status: 404,
      });
    }

    const tagProblemCounts = json.data.matchedUser.tagProblemCounts;

    const prompt = `
Act as an experienced DSA coach.
Here is the LeetCode topic-wise progress of a student (username: ${username}):

Fundamental:
${tagProblemCounts.fundamental.map(tag => `${tag.tagName}: ${tag.problemsSolved}`).join('\n')}

Intermediate:
${tagProblemCounts.intermediate.map(tag => `${tag.tagName}: ${tag.problemsSolved}`).join('\n')}

Advanced:
${tagProblemCounts.advanced.map(tag => `${tag.tagName}: ${tag.problemsSolved}`).join('\n')}

Based on this data, answer:
1. What are this user's strengths and weaknesses in DSA topics?
2. Which topic areas need more focus?
3. What difficulty level should they work on more?
4. Suggest a personalized 30-day study plan.
5. For each missing topic, recommend 1-2 high-quality YouTube videos. Each recommendation must include:
- Topic Name
- Why it's important
- Video title
- YouTube link

Respond in a clear, structured format.
`;

    const aiInsights = await getAIResponse(prompt);

    return new Response(JSON.stringify({
      ...tagProblemCounts,
      aiInsights,
    }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch LeetCode data or AI response" }), {
      status: 500,
    });
  }
}
