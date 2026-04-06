/**
 * rehype plugin to transform GitHub-style alert blockquotes
 * Matches: > [!WARNING], > [!NOTE], > [!TIP], > [!IMPORTANT], > [!CAUTION]
 */

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
