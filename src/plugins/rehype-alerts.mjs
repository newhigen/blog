/**
 * rehype plugin to transform GitHub-style alert blockquotes
 * Matches: > [!WARNING], > [!NOTE], > [!TIP], > [!IMPORTANT], > [!CAUTION], > [!INFO]
 * Uses Font Awesome icon paths
 */

const iconPaths = {
  note: {
    viewBox: '0 0 192 512',
    path: 'M96 0C43 0 0 43 0 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-64h-64v192h64V64z',
  },
  info: {
    viewBox: '0 0 192 512',
    path: 'M96 0C43 0 0 43 0 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-64h-64v192h64V64z',
  },
  warning: {
    viewBox: '0 0 576 512',
    path: 'M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.6-40.025-41.577-71.987L246.423 23.985c18.467-32.009 64.72-32.009 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43-165h86v-40h-86v40z',
  },
  important: {
    viewBox: '0 0 576 512',
    path: 'M316.9 18C331.6 5.1 351.4 5 366.3 17.9l0 0 0 0 137.2 112.2c16.4 13.4 24.9 32.8 24.9 53.1V360c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V183.1c0-20.3 8.5-39.7 24.9-53.1L137.7 17.9 0 0 288 0 316.9 18zm-147.7 128l-144 144 144 144 144-144-144-144z',
  },
  caution: {
    viewBox: '0 0 192 512',
    path: 'M96 0C43 0 0 43 0 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 169.3c-40.3 0-73.3 33-73.3 73.3s33 73.3 73.3 73.3 73.3-33 73.3-73.3-33-73.3-73.3-73.3zm39.5-40.3h-79V50.4h79v78.6z',
  },
  tip: {
    viewBox: '0 0 384 512',
    path: 'M272 384c9.6-31.9 29.5-59.1 49.2-82.4 20.5-24.1 48.8-50.565 48.8-84.1 0-56.6-21.3-107.6-63.7-150C289.8 37 240 0 192 0s-97.8 37-113.3 65.5C36.3 108.4 15 159.4 15 216c0 33.5 28.3 60 48.8 84.1 19.7 23.3 39.6 50.5 49.2 82.4H272zM192 512c35.3 0 64-28.7 64-64H128c0 35.3 28.7 64 64 64z',
  },
}

const getIconPath = (type) => iconPaths[type]?.path || null
const getViewBox = (type) => iconPaths[type]?.viewBox || null

/** @param {import('hast').Root} tree */
export default function rehypeAlerts() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'blockquote') return

      const firstP = node.children?.find((c) => c.type === 'element' && c.tagName === 'p')
      if (!firstP) return

      const firstText = firstP.children?.[0]
      if (!firstText || firstText.type !== 'text') return

      const match = firstText.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO)\]/)
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
      if (currentFirstP) {
        const iconPath = getIconPath(alertType)
        const viewBox = getViewBox(alertType)
        if (iconPath && viewBox) {
          currentFirstP.children.unshift({
            type: 'raw',
            value: `<svg class="alert-icon" viewBox="${viewBox}" fill="currentColor" aria-hidden="true"><path d="${iconPath}"/></svg>`,
          })
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
