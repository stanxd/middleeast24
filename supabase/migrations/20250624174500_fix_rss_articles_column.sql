-- Check if the column published_at exists and publish_date doesn't
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'rss_articles'
        AND column_name = 'published_at'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'rss_articles'
        AND column_name = 'publish_date'
    ) THEN
        -- Rename published_at to publish_date
        ALTER TABLE public.rss_articles RENAME COLUMN published_at TO publish_date;
        RAISE NOTICE 'Column published_at renamed to publish_date';
    ELSIF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'rss_articles'
        AND column_name = 'publish_date'
    ) THEN
        -- Add publish_date column if it doesn't exist
        ALTER TABLE public.rss_articles ADD COLUMN publish_date TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Column publish_date added';
    ELSE
        RAISE NOTICE 'Column publish_date already exists, no changes needed';
    END IF;
END $$;
