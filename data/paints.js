var paints = [
  {
    title:    'fun',
    src:      'fun.jpg',
    next:     'wide',
    prev:     'portrait',
    category: 'oil'
  },
  {
    title:    'wide',
    src:      'painting-wide.jpg',
    next:     'square',
    prev:     'fun',
    category: 'oil'
  },
  {
    title:    'square',
    src:      'painting-square.jpg',
    next:     'portrait',
    prev:     'wide',
    category: 'acrylic'
  },
  {
    title:    'portrait',
    src:      'painting-portrait.jpg',
    next:     'fun',
    prev:     'square',
    category: 'acrylic'
  }
]

module.exports = paints;
