/**
 * remark plugin: converts :공감 inline directive to <sup class="relatable">공감</sup>
 *
 * Usage in markdown: :공감
 */
import { visit } from 'unist-util-visit'

export default function remarkRelatable() {
  return (tree) => {
    visit(tree, 'textDirective', (node, index, parent) => {
      if (node.name !== '공감') return

      node.type = 'html'
      node.value = '<sup class="relatable">공감</sup>'
    })
  }
}
