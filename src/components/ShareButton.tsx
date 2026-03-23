import { useState } from 'react';
import { Share2, Download, Check } from 'lucide-react';
import { toPng } from 'html-to-image';

export const ShareButton = ({ targetId }: { targetId: string }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      const element = document.getElementById(targetId);
      if (!element) throw new Error('Target element not found');

      // Temporarily add styling for the screenshot
      const originalStyle = element.style.cssText;
      element.style.padding = '2rem';
      element.style.background = 'var(--bg-color)';
      element.style.borderRadius = '1rem';
      element.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';

      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: 'transparent',
      });

      // Restore original styling
      element.style.cssText = originalStyle;

      // Create a download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `chat-x-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to share chat:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
      title="Share Chat as Image"
    >
      {isSuccess ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
    </button>
  );
};
