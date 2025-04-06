
/**
 * Service for analyzing grammar in text
 * In a real implementation, this would use NLP libraries or APIs
 */

export interface GrammarIssue {
  text: string;
  issue: string;
  suggestion?: string;
}

export interface GrammarMetrics {
  name: string;
  score: number;
}

// Common grammar issues for simulation
const commonGrammarPatterns = [
  {
    pattern: /\b(has|have)\s+\b(went|ran|came|ate|saw)\b/gi,
    issue: "Incorrect usage of present perfect tense",
    suggestion: "Replace with 'have gone/run/come/eaten/seen'"
  },
  {
    pattern: /\b(don't|doesn't|didn't)\s+\b(likes|wants|needs|goes)\b/gi,
    issue: "Subject-verb agreement error",
    suggestion: "Use the base form of the verb after negations"
  },
  {
    pattern: /\b(me|him|her|them|us)\s+\b(is|are|was|were)\b/gi,
    issue: "Incorrect use of object pronoun as subject",
    suggestion: "Replace with subject pronoun (I, he, she, they, we)"
  },
  {
    pattern: /\b(buyed|goed|taked|breaked|teached)\b/gi,
    issue: "Incorrect past tense form for irregular verb",
    suggestion: "Use the correct irregular form (bought, went, took, broke, taught)"
  },
  {
    pattern: /\b(more|less)\s+(easier|harder|better|worse|faster|slower)\b/gi,
    issue: "Double comparison",
    suggestion: "Use either 'more difficult' or 'harder', not both"
  }
];

// Simulates grammar analysis of text
export const analyzeGrammar = async (text: string): Promise<{
  issues: GrammarIssue[];
  metrics: GrammarMetrics[];
  score: number;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find grammar issues (simulated)
      const issues: GrammarIssue[] = [];
      
      // Check for grammar issues based on patterns
      commonGrammarPatterns.forEach(({ pattern, issue, suggestion }) => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(match => {
            issues.push({
              text: match,
              issue,
              suggestion
            });
          });
        }
      });
      
      // For demo purposes, add random issues if none found
      if (issues.length === 0 && Math.random() > 0.3) {
        const randomIssues = [
          {
            text: "they was",
            issue: "Subject-verb agreement error",
            suggestion: "they were"
          },
          {
            text: "didn't went",
            issue: "Double past tense after negation",
            suggestion: "didn't go"
          },
          {
            text: "more easier",
            issue: "Double comparison",
            suggestion: "easier" 
          }
        ];
        
        // Add 0-2 random issues
        const numIssues = Math.floor(Math.random() * 3);
        for (let i = 0; i < numIssues; i++) {
          if (randomIssues[i] && !text.includes(randomIssues[i].text)) {
            issues.push(randomIssues[i]);
          }
        }
      }
      
      // Calculate metrics (in a real system, these would be calculated using NLP analysis)
      const complexityScore = 2 + Math.random() * 3; // 2-5
      const coherenceScore = 2.5 + Math.random() * 2.5; // 2.5-5
      const fluencyScore = 2 + Math.random() * 3; // 2-5
      const syntaxScore = 2 + Math.random() * 3; // 2-5
      const vocabularyScore = 2.5 + Math.random() * 2.5; // 2.5-5
      
      // Adjust scores based on number of issues
      const issueDeduction = issues.length * 0.3;
      
      const metrics: GrammarMetrics[] = [
        { name: "Complexity", score: Math.max(1, complexityScore - issueDeduction * 0.1) },
        { name: "Coherence", score: Math.max(1, coherenceScore - issueDeduction * 0.05) },
        { name: "Fluency", score: Math.max(1, fluencyScore - issueDeduction * 0.2) },
        { name: "Syntax", score: Math.max(1, syntaxScore - issueDeduction * 0.25) },
        { name: "Vocabulary", score: Math.max(1, vocabularyScore - issueDeduction * 0.1) }
      ];
      
      // Calculate overall score (in real system would use a weighted algorithm)
      const overallScore = Math.min(5, Math.max(1, 
        (metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length) * 
        (1 - (issues.length * 0.08)) // Reduce score based on number of issues
      ));
      
      resolve({
        issues,
        metrics,
        score: parseFloat(overallScore.toFixed(1))
      });
    }, 2500);
  });
};

// Normalize score to 1-5 range
export const normalizeScore = (score: number): number => {
  return Math.min(5, Math.max(1, score));
};
