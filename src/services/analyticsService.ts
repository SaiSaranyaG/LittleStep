/**
 * LittleStep Analytics Telemetry Service (BigQuery Pipeline)
 *
 * Dispatches anonymized behavioral & care telemetry events to the backend
 * ingestion pipeline for aggregation into BigQuery dataset `littlestep_analytics`.
 */

export type AnalyticsEventType =
  | 'user_registered'
  | 'plant_adopted'
  | 'care_task_completed'
  | 'plant_health_checked'
  | 'space_assessed'
  | 'environment_checked'
  | 'recommendation_generated'
  | 'points_earned'
  | 'reward_redeemed'
  | 'milestone_unlocked'
  | 'agent_run_completed';

export interface AnalyticsEventPayload {
  eventType: AnalyticsEventType;
  userId?: string;
  adoptionId?: string;
  speciesId?: string;
  points?: number;
  metadata?: Record<string, unknown>;
}

export async function trackAnalyticsEvent(event: AnalyticsEventPayload): Promise<void> {
  const payload = {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    eventType: event.eventType,
    userId: event.userId || 'anonymous',
    adoptionId: event.adoptionId,
    speciesId: event.speciesId,
    points: event.points,
    timestamp: new Date().toISOString(),
    metadata: event.metadata || {},
  };

  try {
    // Non-blocking fetch to backend BigQuery analytics ingest
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      // Analytics failures must never break the main user experience
      console.debug('[AnalyticsService] Background dispatch notice:', err);
    });
  } catch (err) {
    console.debug('[AnalyticsService] Event dispatch failed:', err);
  }
}
