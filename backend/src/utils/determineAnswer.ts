export function determineAnswer(question: string): boolean | string | null {
  // Example: Detect "True" or "False" in the question
  if (question.toLowerCase().includes('true')) return true;
  if (question.toLowerCase().includes('false')) return false;
  return null; // Or handle other cases
}
