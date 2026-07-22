const dailyInsights = [
  "Tailor your résumé to highlight the skills mentioned in the job description.",

  "Apply when your experience matches the role’s core requirements, even if you do not meet every preference.",

  "Use specific accomplishments instead of listing only your previous responsibilities.",

  "A concise résumé makes it easier for recruiters to identify your most relevant experience.",

  "Research the company’s product, mission, and recent work before your interview.",

  "Prepare a few examples that show how you solved problems, collaborated, and handled setbacks.",

  "Send a brief, personalized thank-you message after an interview.",

  "Track every application so deadlines, contacts, and follow-ups do not get lost.",

  "Review the job description again before each interview and connect its requirements to your experience.",

  "Use numbers when possible to make the impact of your work easier to understand.",

  "Focus your cover letter on why your experience fits this specific role.",

  "Save a copy of each job description because the listing may disappear before your interview.",

  "Quality applications are often more valuable than sending the same résumé to every opening.",

  "Prepare thoughtful questions that help you evaluate whether the company is right for you.",

  "Practice your answers aloud so they sound natural instead of memorized.",

  "Your résumé should make your most relevant skills easy to find within a quick scan.",

  "Keep notes after every interview while the questions and conversations are still fresh.",

  "Following up can demonstrate interest, but keep your message concise and professional.",

  "Rejection is useful data—look for patterns and adjust your approach when necessary.",

  "Set small weekly job-search goals that you can control, such as applications, outreach, and practice."
];

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

// Uses the date to make sure every insight is rotated through, and the update happens at midnight 
export const getDailyInsight = () => {
  const today = new Date();

  const localDayNumber = Math.floor(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ) / MILLISECONDS_PER_DAY,
  );

  const insightIndex = localDayNumber % dailyInsights.length;

  return dailyInsights[insightIndex];
};
