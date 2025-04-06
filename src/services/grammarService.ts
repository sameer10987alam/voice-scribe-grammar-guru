
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

// Expanded grammar issues for more accurate simulation
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
  },
  // Additional patterns for improved accuracy
  {
    pattern: /\b(i|we|they|you)\s+(is|was)\b/gi,
    issue: "Subject-verb agreement error",
    suggestion: "Use 'am/are/were' with these subjects"
  },
  {
    pattern: /\b(she|he|it)\s+(am|are|were)\b/gi,
    issue: "Subject-verb agreement error",
    suggestion: "Use 'is/was' with these subjects"
  },
  {
    pattern: /\b(a)\s+([aeiou]\w+)\b/gi,
    issue: "Incorrect article usage",
    suggestion: "Use 'an' before words starting with vowel sounds"
  },
  {
    pattern: /\b(an)\s+([^aeiou]\w+)\b/gi,
    issue: "Incorrect article usage",
    suggestion: "Use 'a' before words starting with consonant sounds"
  },
  {
    pattern: /\b(less)\s+(\w+s)\b/gi,
    issue: "Incorrect quantifier with countable noun",
    suggestion: "Use 'fewer' with countable nouns"
  },
  {
    pattern: /\bthere\s+(are|were)\s+(\w+)\b/gi,
    issue: "Possible 'there' agreement error",
    suggestion: "Check if singular or plural form is needed"
  }
];

// Add filler words patterns to detect less formal speech patterns
const fillerWordsPatterns = [
  { pattern: /\blike\b/gi, value: -0.05 },
  { pattern: /\bum\b|\buh\b/gi, value: -0.1 },
  { pattern: /\byou know\b/gi, value: -0.05 },
  { pattern: /\bbasically\b/gi, value: -0.03 },
  { pattern: /\bactually\b/gi, value: -0.02 },
  { pattern: /\bi mean\b/gi, value: -0.04 }
];

// Positive grammar patterns (phrases showing advanced language use)
const positivePatterns = [
  { pattern: /\b(nevertheless|furthermore|consequently|moreover)\b/gi, value: 0.15 },
  { pattern: /\b(in addition to|as well as|not only.*but also)\b/gi, value: 0.1 },
  { pattern: /\b(however|therefore|thus|hence)\b/gi, value: 0.08 },
  { pattern: /\b(despite|in spite of|notwithstanding)\b/gi, value: 0.12 },
  { pattern: /\b(regarding|concerning|with respect to)\b/gi, value: 0.08 }
];

// Simulates grammar analysis of text
export const analyzeGrammar = async (text: string): Promise<{
  issues: GrammarIssue[];
  metrics: GrammarMetrics[];
  score: number;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Make sure we have text to analyze
      if (!text || text.trim().length < 10) {
        // For very short texts, provide a baseline result
        resolve({
          issues: [],
          metrics: [
            { name: "Complexity", score: 2.5 },
            { name: "Coherence", score: 2.5 },
            { name: "Fluency", score: 2.5 },
            { name: "Syntax", score: 2.5 },
            { name: "Vocabulary", score: 2.5 }
          ],
          score: 2.5
        });
        return;
      }
      
      // Find grammar issues (simulated)
      const issues: GrammarIssue[] = [];
      
      // Check for grammar issues based on patterns
      commonGrammarPatterns.forEach(({ pattern, issue, suggestion }) => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Check if this exact issue has already been added
            const isDuplicate = issues.some(existingIssue => 
              existingIssue.text === match && existingIssue.issue === issue
            );
            
            if (!isDuplicate) {
              issues.push({
                text: match,
                issue,
                suggestion
              });
            }
          });
        }
      });
      
      // For demo purposes, add contextual issues based on text content
      if (issues.length === 0 && text.length > 30) {
        // More realistic issue detection based on text content
        if (text.toLowerCase().includes("i think") || text.toLowerCase().includes("i believe")) {
          issues.push({
            text: text.toLowerCase().includes("i think") ? "i think" : "i believe",
            issue: "Filler phrase - reduces clarity",
            suggestion: "Consider removing or rephrasing for more direct statement"
          });
        }
        
        if (text.toLowerCase().includes("very") || text.toLowerCase().includes("really")) {
          issues.push({
            text: text.toLowerCase().includes("very") ? "very" : "really",
            issue: "Vague intensifier",
            suggestion: "Use more specific descriptive language"
          });
        }
      }
      
      // Calculate metrics using a more sophisticated approach
      // Calculate text complexity factors
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.length > 0);
      const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
      const longWordCount = words.filter(word => word.length > 6).length;
      const complexityRatio = words.length > 0 ? longWordCount / words.length : 0;
      
      // Base scores on text characteristics and error count
      let complexityScore = 3 + (avgWordsPerSentence > 12 ? 1 : 0) + (complexityRatio > 0.2 ? 1 : 0);
      complexityScore = Math.min(5, Math.max(1, complexityScore));
      
      // Coherence based on sentence structure indicators
      const transitionWords = ['however', 'therefore', 'consequently', 'moreover', 'furthermore'];
      const transitionCount = transitionWords.reduce((count, word) => 
        count + (text.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);
      
      // Add randomization factor based on text length and characteristics
      const textComplexityFactor = (text.length % 13) / 10; // Adds variety based on text length
      const sentenceVarietyFactor = sentences.length > 3 ? (sentences.length % 5) / 10 : 0;
      
      // Calculate positive and negative factors based on patterns
      let fillerWordsPenalty = 0;
      fillerWordsPatterns.forEach(({ pattern, value }) => {
        const matches = text.match(pattern);
        if (matches) {
          fillerWordsPenalty += value * matches.length;
        }
      });
      
      let advancedLanguageBonus = 0;
      positivePatterns.forEach(({ pattern, value }) => {
        const matches = text.match(pattern);
        if (matches) {
          advancedLanguageBonus += value * matches.length;
        }
      });
      
      const coherenceScore = Math.min(5, Math.max(1, 3 + (transitionCount > 0 ? 0.5 : 0) + 
                                               (avgWordsPerSentence > 5 ? 0.5 : 0) +
                                               sentenceVarietyFactor + 
                                               (advancedLanguageBonus * 0.5)));
      
      // Fluency affected by grammar issues and filler words
      const fluencyBase = 3.5 + textComplexityFactor;
      const fluencyScore = Math.min(5, Math.max(1, fluencyBase - (issues.length * 0.3) + fillerWordsPenalty));
      
      // Syntax directly impacted by grammar issues
      const syntaxBase = 3.7 + sentenceVarietyFactor;
      const syntaxScore = Math.min(5, Math.max(1, syntaxBase - (issues.length * 0.4)));
      
      // Vocabulary assessment
      const uniqueWords = new Set(words.map(w => w.toLowerCase()));
      const lexicalDiversity = words.length > 0 ? uniqueWords.size / words.length : 0;
      const vocabularyScore = Math.min(5, Math.max(1, 2.5 + (lexicalDiversity > 0.7 ? 1.5 : lexicalDiversity > 0.5 ? 1 : 0.5) + advancedLanguageBonus));
      
      const metrics: GrammarMetrics[] = [
        { name: "Complexity", score: parseFloat(complexityScore.toFixed(1)) },
        { name: "Coherence", score: parseFloat(coherenceScore.toFixed(1)) },
        { name: "Fluency", score: parseFloat(fluencyScore.toFixed(1)) },
        { name: "Syntax", score: parseFloat(syntaxScore.toFixed(1)) },
        { name: "Vocabulary", score: parseFloat(vocabularyScore.toFixed(1)) }
      ];
      
      // Calculate weighted overall score
      // Weight syntax and fluency more heavily as they directly reflect grammar
      const weights = {
        Complexity: 0.15,
        Coherence: 0.15,
        Fluency: 0.3,
        Syntax: 0.3,
        Vocabulary: 0.1
      };
      
      const weightedSum = metrics.reduce((sum, metric) => {
        return sum + (metric.score * weights[metric.name as keyof typeof weights]);
      }, 0);
      
      // Apply issue penalty, but make it more gradual
      const issuePenalty = Math.min(0.5, issues.length * 0.1);
      
      // Add random variance to make scores more realistic (controlled randomness)
      const randomVariance = ((Math.sin(text.length) + 1) / 2) * 0.4 - 0.2; // Range: -0.2 to 0.2
      
      // Calculate overall score with variance
      const rawScore = weightedSum * (1 - issuePenalty) + randomVariance;
      const overallScore = Math.min(5, Math.max(1, rawScore));
      
      // Make sure the score is displayed with one decimal point
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
