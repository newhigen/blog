import { visit } from 'unist-util-visit'

export default function remarkTOC() {
  return function (tree, file) {
    const headings = []
    let headingIndex = 0

    visit(tree, 'heading', (node) => {
      const level = node.depth

      if (level > 3) return

      const text = extractTextContent(node)
      if (!text) return

      headings.push({ level, text, index: headingIndex })
      headingIndex++
    })

    if (!file.data.astro) file.data.astro = {}
    if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {}
    file.data.astro.frontmatter.toc = headings
  }
}

function extractTextContent(node) {
  let text = ''

  visit(node, 'text', (textNode) => {
    text += textNode.value
  })

  return text.trim()
}
