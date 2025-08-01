import React, { useEffect } from 'react';

interface BlogPostTriggerProps {
  postId?: string;
}

const BlogPostTrigger: React.FC<BlogPostTriggerProps> = ({ postId }) => {
  // This is a placeholder component that was previously used for sitemap generation
  // Since we've removed the sitemap functionality, this component now does nothing
  // but exists to satisfy import requirements
  
  useEffect(() => {
    // Component is intentionally empty
    // It exists only to resolve import errors
  }, [postId]);

  // Return null as this component doesn't render anything
  return null;
};

export default BlogPostTrigger;