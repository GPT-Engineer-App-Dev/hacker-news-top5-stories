import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { FaExternalLinkAlt, FaThumbsUp } from 'react-icons/fa';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const topStories = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topFiveStories = topStories.data.slice(0, 5);
        const storyDetails = await Promise.all(
          topFiveStories.map(async (id) => {
            const story = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            return story.data;
          })
        );
        setStories(storyDetails);
      } catch (error) {
        console.error('Error fetching top stories:', error);
      }
    };

    fetchTopStories();
  }, []);

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md"
          />
          <div className="flex items-center ml-4">
            <span className="mr-2">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
          </div>
        </div>
        <div className="grid gap-4">
          {filteredStories.map((story) => (
            <Card key={story.id} className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
                <CardDescription>
                  <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Read more <FaExternalLinkAlt className="inline" />
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center">
                <FaThumbsUp className="mr-2" /> {story.score}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;