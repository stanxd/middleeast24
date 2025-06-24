import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, RefreshCw } from 'lucide-react';
import { RSSSource, rssService } from '@/services/RSSService';
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

  // Load sources on component mount
  useEffect(() => {
    setSources(rssService.getSources());
  }, []);

  const handleAddSource = () => {
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

    // Add the new source
    const updatedSources = [...sources, { ...newSource }];
    setSources(updatedSources);
    rssService.setSources(updatedSources);
    
    // Reset form
    setNewSource({
      name: '',
      url: '',
      category: 'News'
    });
    
    toast.success(`Added RSS source: ${newSource.name}`);
  };

  const handleRemoveSource = (index: number) => {
    const updatedSources = [...sources];
    const removedSource = updatedSources[index];
    updatedSources.splice(index, 1);
    setSources(updatedSources);
    rssService.setSources(updatedSources);
    toast.success(`Removed RSS source: ${removedSource.name}`);
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
      await rssService.fetchAllSources();
      toast.success('Successfully fetched articles from all RSS sources');
    } catch (error) {
      console.error('Error fetching RSS sources:', error);
      toast.error('Failed to fetch articles from RSS sources');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">RSS Sources</h2>
          <p className="text-muted-foreground">
            Manage RSS sources for automatic article fetching and sentiment analysis.
          </p>
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
