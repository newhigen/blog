/**
 * rehype plugin to transform GitHub-style alert blockquotes
 * Matches: > [!WARNING], > [!NOTE], > [!TIP], > [!IMPORTANT], > [!CAUTION]
 */

const icons = {
  note: '<svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="white">i</text></svg>',
  warning: '<svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 20h20L12 2zm0 14h-1v1h1v-1zm0-6h-1v5h1V10z"/></svg>',
  important: '<svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  caution: '<svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold" fill="white">!</text></svg>',
  tip: '<svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>',
}

/** @param {import('hast').Root} tree */
export default function rehypeAlerts() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'blockquote') return

      const firstP = node.children?.find((c) => c.type === 'element' && c.tagName === 'p')
      if (!firstP) return

      const firstText = firstP.children?.[0]
      if (!firstText || firstText.type !== 'text') return

      const match = firstText.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/)
      if (!match) return

      const alertType = match[1].toLowerCase()

      // Remove the "[!TYPE]" text (and trailing newline if any)
      const remainder = firstText.value.slice(match[0].length).replace(/^\n/, '')
      if (remainder) {
        firstText.value = remainder
      } else {
        // Remove the text node if empty
        firstP.children.shift()
        // If the first element is now a <br>, remove it too
        if (firstP.children[0]?.tagName === 'br') {
          firstP.children.shift()
        }
        // If the paragraph is now empty, remove it from blockquote
        if (firstP.children.length === 0) {
          const idx = node.children.indexOf(firstP)
          node.children.splice(idx, 1)
        }
      }

      // Add SVG icon as first child if paragraph still exists
      const currentFirstP = node.children?.find((c) => c.type === 'element' && c.tagName === 'p')
      if (currentFirstP && icons[alertType]) {
        currentFirstP.children.unshift({
          type: 'html',
          value: icons[alertType],
        })
      }

      // Add alert classes
      node.properties = node.properties || {}
      const existing = node.properties.className || []
      node.properties.className = [...(Array.isArray(existing) ? existing : [existing]), 'alert', `alert-${alertType}`]
    })
  }
}

function visit(tree, type, visitor) {
  function walk(node) {
    if (node.type === type) visitor(node)
    if (node.children) node.children.forEach(walk)
  }
  walk(tree)
}
