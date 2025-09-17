export interface MetricData {
  name: string;
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  lastProcessedMessage?: Date;
  errorRate: number;
  processedMessages: number;
  failedMessages: number;
  retryCount: number;
}

export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics = new Map<string, MetricData[]>();
  private counters = new Map<string, number>();
  private timers = new Map<string, number>();
  private startTime: Date = new Date();

  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): MetricsCollector {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (MetricsCollector.instance === undefined) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  // Counter metrics
  incrementCounter(name: string, value = 1, tags: Record<string, string> = {}): void {
    const key = this.getMetricKey(name, tags);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);

    this.recordMetric({
      name,
      value: current + value,
      timestamp: new Date(),
      tags,
    });
  }

  // Timer metrics
  startTimer(name: string): string {
    const timerId = `${name}_${Date.now()}_${Math.random()}`;
    this.timers.set(timerId, Date.now());
    return timerId;
  }

  endTimer(timerId: string, tags: Record<string, string> = {}): number {
    const startTime = this.timers.get(timerId);
    if (!startTime) {
      console.warn(`Timer ${timerId} not found`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(timerId);

    const metricName = timerId.split('_')[0] || 'unknown';
    this.recordMetric({
      name: metricName,
      value: duration,
      timestamp: new Date(),
      tags,
    });

    return duration;
  }

  // Gauge metrics
  setGauge(name: string, value: number, tags: Record<string, string> = {}): void {
    this.recordMetric({
      name,
      value,
      timestamp: new Date(),
      tags,
    });
  }

  // Message processing metrics
  recordMessageProcessed(template: string, success: boolean, duration: number): void {
    this.incrementCounter('messages_processed', 1, {
      template,
      status: success ? 'success' : 'failure',
    });

    this.recordMetric({
      name: 'message_processing_duration',
      value: duration,
      timestamp: new Date(),
      tags: { template, status: success ? 'success' : 'failure' },
    });
  }

  recordEmailSent(template: string, success: boolean, duration: number): void {
    this.incrementCounter('emails_sent', 1, {
      template,
      status: success ? 'success' : 'failure',
    });

    this.recordMetric({
      name: 'email_sending_duration',
      value: duration,
      timestamp: new Date(),
      tags: { template, status: success ? 'success' : 'failure' },
    });
  }

  recordRetry(attempt: number, template: string, errorCategory: string): void {
    this.incrementCounter('retries', 1, {
      attempt: attempt.toString(),
      template: template || 'unknown',
      error_category: errorCategory,
    });
  }

  recordSqsOperation(operation: string, success: boolean, messageCount?: number): void {
    this.incrementCounter('sqs_operations', 1, {
      operation,
      status: success ? 'success' : 'failure',
    });

    if (messageCount !== undefined) {
      this.setGauge('sqs_messages_received', messageCount, { operation });
    }
  }

  // Health check
  getServiceHealth(): ServiceHealth {
    const processedMessages = this.getCounterValue('messages_processed', { status: 'success' });
    const failedMessages = this.getCounterValue('messages_processed', { status: 'failure' });
    const retryCount = this.getCounterValue('retries');

    const totalMessages = processedMessages + failedMessages;
    const errorRate = totalMessages > 0 ? (failedMessages / totalMessages) * 100 : 0;

    let status: ServiceHealth['status'] = 'healthy';
    if (errorRate > 50) {
      status = 'unhealthy';
    } else if (errorRate > 10) {
      status = 'degraded';
    }

    return {
      status,
      uptime: Date.now() - this.startTime.getTime(),
      lastProcessedMessage: this.getLastProcessedMessageTime(),
      errorRate,
      processedMessages,
      failedMessages,
      retryCount,
    };
  }

  // Get metrics for monitoring
  getMetrics(name?: string): MetricData[] {
    if (name) {
      return this.metrics.get(name) || [];
    }

    const allMetrics: MetricData[] = [];
    for (const metricList of this.metrics.values()) {
      allMetrics.push(...metricList);
    }

    return allMetrics;
  }

  // Get counter value
  getCounterValue(name: string, tags: Record<string, string> = {}): number {
    const key = this.getMetricKey(name, tags);
    return this.counters.get(key) || 0;
  }

  // Clear old metrics (keep last 1000 per metric)
  cleanup(): void {
    for (const [name, metrics] of this.metrics.entries()) {
      if (metrics.length > 1000) {
        this.metrics.set(name, metrics.slice(-1000));
      }
    }
  }

  private recordMetric(metric: MetricData): void {
    const key = this.getMetricKey(metric.name, metric.tags);
    const existing = this.metrics.get(key) || [];
    existing.push(metric);
    this.metrics.set(key, existing);
  }

  private getMetricKey(name: string, tags: Record<string, string>): string {
    const tagString = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join(',');

    return tagString ? `${name}[${tagString}]` : name;
  }

  private getLastProcessedMessageTime(): Date | undefined {
    const allMetrics = this.getMetrics('messages_processed');
    if (allMetrics.length === 0) return undefined;

    const latest = allMetrics.reduce((latest, current) =>
      current.timestamp > latest.timestamp ? current : latest,
    );

    return latest.timestamp;
  }
}

// Export singleton instance
export const metrics = MetricsCollector.getInstance();
