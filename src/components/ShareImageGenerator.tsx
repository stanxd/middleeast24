import React, { useEffect, useRef } from 'react';
import { Article } from '../types/Article';

interface ShareImageGeneratorProps {
  article: Article;
  onImageGenerated: (imageUrl: string) => void;
}

const ShareImageGenerator: React.FC<ShareImageGeneratorProps> = ({ article, onImageGenerated }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateImage = async () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas dimensions
      canvas.width = 1200;
      canvas.height = 630;

      // Load article image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = article.image;

      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Draw background image with overlay
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Add semi-transparent overlay for better text visibility
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw title text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        
        // Wrap text to fit canvas width
        const maxWidth = canvas.width - 100;
        const words = article.title.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);

        // Draw each line of text
        let y = canvas.height / 2 - ((lines.length - 1) * 60) / 2;
        for (const line of lines) {
          ctx.fillText(line, canvas.width / 2, y);
          y += 60;
        }

        // Load and draw logo
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        logo.src = '/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png';

        await new Promise((resolve, reject) => {
          logo.onload = resolve;
          logo.onerror = reject;
        });

        // Draw logo in bottom right corner
        const logoSize = 100;
        ctx.drawImage(logo, canvas.width - logoSize - 20, canvas.height - logoSize - 20, logoSize, logoSize);
        
        // Add website URL
        ctx.font = '24px Arial';
        ctx.fillText('middleeast24.org', canvas.width - logoSize - 20, canvas.height - 20);

        // Convert canvas to data URL and pass it to the callback
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        onImageGenerated(imageUrl);
      } catch (error) {
        console.error('Error generating share image:', error);
      }
    };

    generateImage();
  }, [article, onImageGenerated]);

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default ShareImageGenerator;
