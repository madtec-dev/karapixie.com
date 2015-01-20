var paints = [
  {
    title: 'fun',
    src:   'fun.jpg',
    next:  'wide',
    prev:  'portrait'
  },
  {
    title: 'wide',
    src:   'painting-wide.jpg',
    next:  'square',
    prev:  'fun'
  },
  {
    title: 'square',
    src:   'painting-square.jpg',
    next:  'portrait',
    prev:  'wide'
  },
  {
    title: 'portrait',
    src:   'painting-portrait.jpg',
    next:  'fun',
    prev:  'square'
  }
]

module.exports = paints;
