interface HelpInteraction {
  timestamp: number;
  type: string;
  topic: string;
  duration: number;
  wasHelpful: boolean;
  userFollowUp?: boolean;
}

interface TopicStats {
  views: number;
  avgDuration: number;
  helpfulRate: number;
  followUpRate: number;
}

const STORAGE_KEY = 'help-interaction-history';
const MAX_HISTORY = 100;

class HelpInteractionTracker {
  private interactions: HelpInteraction[] = [];
  private topicStats: Map<string, TopicStats> = new Map();

  constructor() {
    this.loadFromStorage();
    this.calculateStats();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.interactions = JSON.parse(stored);
    }
  }

  private saveToStorage() {
    // Keep only the most recent interactions
    this.interactions = this.interactions.slice(-MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.interactions));
  }

  private calculateStats() {
    this.topicStats.clear();
    const topics = new Map<string, HelpInteraction[]>();

    // Group interactions by topic
    this.interactions.forEach((interaction) => {
      const topicInteractions = topics.get(interaction.topic) || [];
      topicInteractions.push(interaction);
      topics.set(interaction.topic, topicInteractions);
    });

    // Calculate stats for each topic
    topics.forEach((topicInteractions, topic) => {
      const stats: TopicStats = {
        views: topicInteractions.length,
        avgDuration: this.calculateAverage(
          topicInteractions.map((i) => i.duration)
        ),
        helpfulRate: this.calculatePercentage(
          topicInteractions.filter((i) => i.wasHelpful).length,
          topicInteractions.length
        ),
        followUpRate: this.calculatePercentage(
          topicInteractions.filter((i) => i.userFollowUp).length,
          topicInteractions.length
        ),
      };
      this.topicStats.set(topic, stats);
    });
  }

  private calculateAverage(numbers: number[]): number {
    return numbers.length
      ? numbers.reduce((a, b) => a + b, 0) / numbers.length
      : 0;
  }

  private calculatePercentage(part: number, total: number): number {
    return total ? (part / total) * 100 : 0;
  }

  trackInteraction(interaction: Omit<HelpInteraction, 'timestamp'>) {
    const newInteraction: HelpInteraction = {
      ...interaction,
      timestamp: Date.now(),
    };

    this.interactions.push(newInteraction);
    this.saveToStorage();
    this.calculateStats();
  }

  updateInteraction(topic: string, updates: Partial<HelpInteraction>) {
    const interaction = this.interactions.findLast((i) => i.topic === topic);
    if (interaction) {
      Object.assign(interaction, updates);
      this.saveToStorage();
      this.calculateStats();
    }
  }

  getTopicStats(topic: string): TopicStats | undefined {
    return this.topicStats.get(topic);
  }

  getMostHelpfulTopics(): string[] {
    return Array.from(this.topicStats.entries())
      .sort(([, a], [, b]) => b.helpfulRate - a.helpfulRate)
      .map(([topic]) => topic);
  }

  getMostViewedTopics(): string[] {
    return Array.from(this.topicStats.entries())
      .sort(([, a], [, b]) => b.views - a.views)
      .map(([topic]) => topic);
  }

  getRecentInteractions(limit: number = 10): HelpInteraction[] {
    return this.interactions
      .slice(-limit)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getSuggestedTopics(currentTopic: string): string[] {
    const currentStats = this.topicStats.get(currentTopic);
    if (!currentStats) return [];

    // Find topics with similar engagement patterns
    return Array.from(this.topicStats.entries())
      .filter(([topic, stats]) => {
        if (topic === currentTopic) return false;

        const durationDiff = Math.abs(
          stats.avgDuration - currentStats.avgDuration
        );
        const helpfulDiff = Math.abs(
          stats.helpfulRate - currentStats.helpfulRate
        );

        // Topics with similar duration and helpfulness
        return durationDiff < 30000 && helpfulDiff < 20;
      })
      .sort(([, a], [, b]) => b.views - a.views)
      .map(([topic]) => topic)
      .slice(0, 3);
  }

  getTopicTrends(): { topic: string; trend: 'up' | 'down' | 'stable' }[] {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const trends = Array.from(this.topicStats.keys()).map((topic) => {
      const recentInteractions = this.interactions.filter(
        (i) => i.topic === topic && i.timestamp > weekAgo
      );

      const oldInteractions = this.interactions.filter(
        (i) => i.topic === topic && i.timestamp <= weekAgo
      );

      const recentHelpful = this.calculatePercentage(
        recentInteractions.filter((i) => i.wasHelpful).length,
        recentInteractions.length
      );

      const oldHelpful = this.calculatePercentage(
        oldInteractions.filter((i) => i.wasHelpful).length,
        oldInteractions.length
      );

      const trend: 'up' | 'down' | 'stable' =
        recentHelpful > oldHelpful + 10
          ? 'up'
          : recentHelpful < oldHelpful - 10
            ? 'down'
            : 'stable';

      return { topic, trend };
    });

    return trends;
  }
}

// Create singleton instance
export const helpInteractionTracker = new HelpInteractionTracker();
