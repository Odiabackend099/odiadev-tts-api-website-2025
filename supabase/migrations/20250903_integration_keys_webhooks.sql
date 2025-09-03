-- Create enum for integration service types
CREATE TYPE integration_service AS ENUM ('tts', 'brain', 'n8n');

-- Create integration_keys table
CREATE TABLE integration_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    key TEXT NOT NULL UNIQUE,
    service integration_service NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMPTZ
);

-- Create webhook_events table to store possible event types
CREATE TABLE webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default webhook events
INSERT INTO webhook_events (name, description) VALUES
    ('new_lead', 'Triggered when a new lead is created'),
    ('status_change', 'Triggered when a lead status changes'),
    ('conversation', 'Triggered when a conversation is created or updated'),
    ('intake_submission', 'Triggered when an intake form is submitted');

-- Create webhooks table
CREATE TABLE webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    description TEXT,
    secret TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    failure_count INT DEFAULT 0
);

-- Create webhook_subscriptions junction table
CREATE TABLE webhook_subscriptions (
    webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
    event_id UUID REFERENCES webhook_events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (webhook_id, event_id)
);

-- Create webhook_delivery_logs table
CREATE TABLE webhook_delivery_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
    event_id UUID REFERENCES webhook_events(id),
    payload JSONB,
    response_status INT,
    response_body TEXT,
    error_message TEXT,
    delivered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_integration_keys_service ON integration_keys(service);
CREATE INDEX idx_integration_keys_created_by ON integration_keys(created_by);
CREATE INDEX idx_webhooks_created_by ON webhooks(created_by);
CREATE INDEX idx_webhook_delivery_logs_webhook_id ON webhook_delivery_logs(webhook_id);
CREATE INDEX idx_webhook_delivery_logs_delivered_at ON webhook_delivery_logs(delivered_at);

-- Create RLS policies
ALTER TABLE integration_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Integration keys policies
CREATE POLICY "Users can view their own integration keys"
    ON integration_keys FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own integration keys"
    ON integration_keys FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own integration keys"
    ON integration_keys FOR UPDATE
    USING (auth.uid() = created_by);

-- Webhooks policies
CREATE POLICY "Users can view their own webhooks"
    ON webhooks FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own webhooks"
    ON webhooks FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own webhooks"
    ON webhooks FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own webhooks"
    ON webhooks FOR DELETE
    USING (auth.uid() = created_by);

-- Webhook subscriptions policies
CREATE POLICY "Users can view their webhook subscriptions"
    ON webhook_subscriptions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM webhooks
        WHERE webhooks.id = webhook_subscriptions.webhook_id
        AND webhooks.created_by = auth.uid()
    ));

CREATE POLICY "Users can manage their webhook subscriptions"
    ON webhook_subscriptions FOR ALL
    USING (EXISTS (
        SELECT 1 FROM webhooks
        WHERE webhooks.id = webhook_subscriptions.webhook_id
        AND webhooks.created_by = auth.uid()
    ));

-- Functions for managing webhooks
CREATE OR REPLACE FUNCTION get_webhook_events(webhook_id UUID)
RETURNS TABLE (event_name TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT we.name
    FROM webhook_subscriptions ws
    JOIN webhook_events we ON we.id = ws.event_id
    WHERE ws.webhook_id = $1;
$$;
