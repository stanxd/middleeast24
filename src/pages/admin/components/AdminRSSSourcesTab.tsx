import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, RefreshCw, Clock, Database } from 'lucide-react';
import { RSSSource, rssService } from '@/services/RSSService';
import { useRSSArticles } from '@/hooks/useRSSArticles';
import { toast } from 'sonner';

const AdminRSSSourcesTab: React.FC = () => {
  const [sources, setSources] = useState<RSSSource[]>([]);
  const [newSource, setNewSource] = useState<RSSSource>({
    name: '',
    url: '',
    category: 'News'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(15); // minutes
  const autoRefreshIntervalRef = useRef<number | null>(null);
  
  // Use the RSS articles hook to get and refresh articles
  const { articles, refresh: refreshArticles, lastRefreshed } = useRSSArticles();

  // Load sources on component mount
  useEffect(() => {
    const loadSources = async () => {
      try {
        const sources = await rssService.getSources();
        setSources(sources);
      } catch (error) {
        console.error('Error loading RSS sources:', error);
        toast.error('Failed to load RSS sources');
      }
    };
    
    loadSources();
  }, []);

  // Set up auto-refresh interval
  useEffect(() => {
    // Clear any existing interval
    if (autoRefreshIntervalRef.current) {
      window.clearInterval(autoRefreshIntervalRef.current);
      autoRefreshIntervalRef.current = null;
    }

    // Set up new interval if auto-refresh is enabled
    if (autoRefresh) {
      toast.info(`Auto-refresh enabled. Fetching RSS sources every ${refreshInterval} minutes.`);
      
      // Convert minutes to milliseconds
      const intervalMs = refreshInterval * 60 * 1000;
      
      autoRefreshIntervalRef.current = window.setInterval(() => {
        console.log(`Auto-refresh: Fetching RSS sources (${new Date().toLocaleTimeString()})`);
        handleFetchAllSources();
      }, intervalMs);
    }

    // Clean up interval on component unmount
    return () => {
      if (autoRefreshIntervalRef.current) {
        window.clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  const handleAddSource = async () => {
    // Validate inputs
    if (!newSource.name.trim() || !newSource.url.trim()) {
      toast.error('Please provide both name and URL for the RSS source');
      return;
    }

    // Check if URL is valid
    try {
      new URL(newSource.url);
    } catch (e) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    try {
      // Add the new source to the database
      await rssService.addSource(newSource);
      
      // Refresh the sources list
      const updatedSources = await rssService.getSources();
      setSources(updatedSources);
      
      // Reset form
      setNewSource({
        name: '',
        url: '',
        category: 'News'
      });
      
      toast.success(`Added RSS source: ${newSource.name}`);
    } catch (error) {
      console.error('Error adding RSS source:', error);
      toast.error('Failed to add RSS source');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSource = async (index: number) => {
    const sourceToRemove = sources[index];
    setIsLoading(true);
    
    try {
      // Create a new array without the removed source
      const updatedSources = sources.filter((_, i) => i !== index);
      
      // Update the database
      await rssService.setSources(updatedSources);
      
      // Update the local state
      setSources(updatedSources);
      
      toast.success(`Removed RSS source: ${sourceToRemove.name}`);
    } catch (error) {
      console.error('Error removing RSS source:', error);
      toast.error('Failed to remove RSS source');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setNewSource(prev => ({
      ...prev,
      category: value as 'News' | 'Investigations' | 'Exclusive Sources'
    }));
  };

  const handleFetchAllSources = async () => {
    setIsFetching(true);
    try {
      console.log('Starting to fetch articles from all RSS sources...');
      await rssService.fetchAllSources();
      console.log('Successfully fetched articles from all RSS sources');
      
      // Refresh the articles display
      await refreshArticles();
      
      toast.success('Successfully fetched articles from all RSS sources');
      
      // Update last fetch time
      setLastFetchTime(new Date());
    } catch (error) {
      console.error('Error fetching RSS sources:', error);
      toast.error('Failed to fetch articles from RSS sources. Check console for details.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAutoRefreshToggle = (checked: boolean) => {
    setAutoRefresh(checked);
  };

  const handleRefreshIntervalChange = (value: string) => {
    const interval = parseInt(value, 10);
    setRefreshInterval(interval);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">RSS Sources</h2>
          <p className="text-muted-foreground">
            Manage RSS sources for automatic article fetching and sentiment analysis.
          </p>
          <div className="flex items-center gap-2 mt-1">
            {lastFetchTime && (
              <p className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Last fetched: {lastFetchTime.toLocaleString()}
              </p>
            )}
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Database className="h-3 w-3" />
              {articles.length} articles
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2 mb-1">
              <Label htmlFor="auto-refresh" className="text-sm">Auto-refresh</Label>
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={handleAutoRefreshToggle}
              />
            </div>
            {autoRefresh && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="refresh-interval" className="text-xs">Every</Label>
                <Select
                  value={refreshInterval.toString()}
                  onValueChange={handleRefreshIntervalChange}
                >
                  <SelectTrigger id="refresh-interval" className="h-7 w-20">
                    <SelectValue placeholder="15" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs">minutes</span>
              </div>
            )}
          </div>
          <Button 
            onClick={handleFetchAllSources} 
            disabled={isFetching}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isFetching ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Fetch All Sources
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New RSS Source</CardTitle>
          <CardDescription>
            Add a new RSS feed source to automatically fetch articles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Source Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Al Jazeera"
                  value={newSource.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newSource.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="News">News</SelectItem>
                    <SelectItem value="Investigations">Investigations</SelectItem>
                    <SelectItem value="Exclusive Sources">Exclusive Sources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">RSS Feed URL</Label>
              <Input
                id="url"
                name="url"
                placeholder="https://example.com/rss.xml"
                value={newSource.url}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddSource} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Source
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Current RSS Sources</h3>
        {sources.length === 0 ? (
          <p className="text-muted-foreground">No RSS sources configured yet.</p>
        ) : (
          sources.map((source, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{source.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSource(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-xs">
                  Category: {source.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground break-all">{source.url}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRSSSourcesTab;
