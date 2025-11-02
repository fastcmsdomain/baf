import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorates the hero block with full bleed viewport image and centered content
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  // Extract content from block structure
  const rows = [...block.children];
  const content = {
    image: null,
    title: null,
    description: null,
  };

  // Process each row to extract image, title, and description
  rows.forEach((row) => {
    const cells = [...row.children];
    
    cells.forEach((cell) => {
      // Check for image
      const picture = cell.querySelector('picture');
      if (picture && !content.image) {
        content.image = picture;
      }
      
      // Check for title (h1 or h2)
      const heading = cell.querySelector('h1, h2, h3');
      if (heading && !content.title) {
        content.title = heading;
      }
      
      // Check for description (p tags or other text content)
      // Filter out paragraphs that contain pictures
      const paragraphs = cell.querySelectorAll('p');
      const textParagraphs = Array.from(paragraphs).filter((p) => !p.querySelector('picture'));
      if (textParagraphs.length > 0 && !content.description) {
        const descWrapper = document.createElement('div');
        descWrapper.className = 'hero-description';
        textParagraphs.forEach((p) => descWrapper.appendChild(p));
        content.description = descWrapper;
      }
    });
  });

  // Clear block content
  block.innerHTML = '';

  // Create image container with overlay
  if (content.image) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-image-wrapper';
    
    // Replace with optimized picture if needed
    const img = content.image.querySelector('img');
    if (img) {
      const optimizedPicture = createOptimizedPicture(
        img.src || img.getAttribute('data-src') || '',
        img.alt || '',
        true, // eager load for hero
        [{ media: '(min-width: 900px)', width: '2000' }, { width: '1200' }],
      );
      imageWrapper.appendChild(optimizedPicture);
    } else {
      imageWrapper.appendChild(content.image);
    }
    
    // Create blue overlay
    const overlay = document.createElement('div');
    overlay.className = 'hero-overlay';
    imageWrapper.appendChild(overlay);
    
    block.appendChild(imageWrapper);
  }

  // Create content wrapper for title and description
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-content';
  
  if (content.title) {
    contentWrapper.appendChild(content.title);
  }
  
  if (content.description) {
    contentWrapper.appendChild(content.description);
  }
  
  block.appendChild(contentWrapper);
}

