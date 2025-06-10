export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
  
    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
      });
    }
  
    try {
      const res = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Referer: `https://leetcode.com/${username}/`,
        },
        body: JSON.stringify({
          query: `
            query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                username
                profile {
                  ranking
                  reputation
                  starRating
                  userAvatar
                  realName
                  aboutMe
                  countryName
                  school
                  websites
                  skillTags
                  company
                }
                submitStats: submitStatsGlobal {
                  acSubmissionNum {
                    difficulty
                    count
                    submissions
                  }
                }
              }
              userContestRanking(username: $username) {
                attendedContestsCount
                rating
                globalRanking
                totalParticipants
                topPercentage
              }
            }
          `,
          variables: { username },
        }),
      });
  
      const data = await res.json();
      if (!data.data?.matchedUser) {
        return new Response(
          JSON.stringify({ error: "User not found or private profile" }),
          { status: 404 }
        );
      }
  
      return new Response(JSON.stringify(data.data), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Something went wrong", details: error.message }),
        { status: 500 }
      );
    }
  }
  