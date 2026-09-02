/**
 * LittleStep Analytics Telemetry Service (BigQuery Pipeline - BUG-10)
 *
 * Dispatches behavioral & care telemetry events to the backend
 * ingestion pipeline for streaming into BigQuery dataset `littlestep_analytics`.
 */

export type CanonicalEventType =
  | 'account_created'
  | 'login'
  | 'space_assessed'
  | 'plant_recommended'
  | 'plant_adopted'
  | 'care_task_completed'
  | 'health_diagnostic'
  | 'milestone_unlocked'
  | 'reward_redeemed'
  | 'logout';

export interface CanonicalAnalyticsEventPayload {
  eventType: CanonicalEventType | string;
  userId?: string;
  entityId?: string;
  entityType?: 'space' | 'plant' | 'care_task' | 'diagnostic' | 'reward' | 'milestone' | 'user' | string;
  metadata?: Record<string, unknown>;
}

export async function trackAnalyticsEvent(event: CanonicalAnalyticsEventPayload): Promise<void> {
  const payload = {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    eventType: event.eventType,
    userId: event.userId || 'anonymous',
    timestamp: new Date().toISOString(),
    entityId: event.entityId,
    entityType: event.entityType,
    metadata: event.metadata || {},
    environment: import.meta.env.MODE || 'development',
  };

  try {
    // Non-blocking fetch to backend BigQuery analytics ingestion pipeline
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.debug('[AnalyticsService] Background Ingestion notice:', err);
    });
  } catch (err) {
    console.debug('[AnalyticsService] Event dispatch failed:', err);
  }
}
