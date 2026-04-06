/**
 * rehype plugin to transform GitHub-style alert blockquotes
 * Matches: > [!WARNING], > [!NOTE], > [!TIP], > [!IMPORTANT], > [!CAUTION], > [!INFO]
 * Uses Font Awesome icon paths
 */

const iconPaths = {
  tip: {
    viewBox: '0 0 640 640',
    path: 'M235.5 102.8C256.3 68 300.5 54 338 71.6L345.2 75.4C380 96.3 394 140.5 376.4 178L376.4 178L362.3 208L472 208L479.4 208.4C515.7 212.1 544 242.8 544 280C544 293.2 540.4 305.4 534.2 316C540.3 326.6 543.9 338.8 544 352C544 370.3 537.1 386.8 526 399.5C527.3 404.8 528 410.3 528 416C528 441.1 515.1 463 495.8 475.9C493.9 511.4 466.4 540.1 431.4 543.6L424 544L319.9 544C301.9 544 284 540.6 267.3 534.1L260.2 531.1L259.5 530.8L252.9 527.6L252.2 527.3L240 520.8C227.7 514.3 216.7 506.1 207.1 496.7C203 523.6 179.8 544.1 151.8 544.1L119.8 544.1C88.9 544.1 63.8 519 63.8 488.1L64 264C64 233.1 89.1 208 120 208L152 208C162.8 208 172.9 211.1 181.5 216.5L231.6 110L232.2 108.8L234.9 103.8L235.5 102.9zM120 256C115.6 256 112 259.6 112 264L112 488C112 492.4 115.6 496 120 496L152 496C156.4 496 160 492.4 160 488L160 264C160 259.6 156.4 256 152 256L120 256zM317.6 115C302.8 108.1 285.3 113.4 276.9 127L274.7 131L217.9 251.9C214.4 259.4 212.4 267.4 211.9 275.6L211.8 279.8L211.8 392.7L212 400.6C214.4 433.3 233.4 462.7 262.7 478.3L274.2 484.4L280.5 487.5C292.9 493.1 306.3 496 319.9 496L424 496L426.4 495.9C438.5 494.7 448 484.4 448 472L447.8 469.4C447.7 468.5 447.6 467.7 447.4 466.8C444.7 454.7 451.7 442.6 463.4 438.8C473.1 435.7 480 426.6 480 416C480 411.7 478.9 407.8 476.9 404.2C470.6 393.1 474.1 379 484.9 372.2C491.7 367.9 496.1 360.4 496.1 352C496.1 344.9 493 338.5 487.9 334C482.7 329.4 479.7 322.9 479.7 316C479.7 309.1 482.7 302.6 487.9 298C493 293.5 496.1 287.1 496.1 280L496 277.6C494.9 266.3 485.9 257.3 474.6 256.2L472.2 256.1L324.7 256.1C316.5 256.1 308.9 251.9 304.5 245C300.1 238.1 299.5 229.3 303 221.9L333 157.6C340 142.6 334.4 124.9 320.5 116.6L317.6 115z'
  },
  note: {
    viewBox: '0 0 640 640',
    path: 'M336 496L160 496C151.2 496 144 488.8 144 480L144 160C144 151.2 151.2 144 160 144L480 144C488.8 144 496 151.2 496 160L496 336L408 336C368.2 336 336 368.2 336 408L336 496zM476.1 384L384 476.1L384 408C384 394.7 394.7 384 408 384L476.1 384zM96 480C96 515.3 124.7 544 160 544L357.5 544C374.5 544 390.8 537.3 402.8 525.3L525.3 402.7C537.3 390.7 544 374.4 544 357.4L544 160C544 124.7 515.3 96 480 96L160 96C124.7 96 96 124.7 96 160L96 480z'
  },
  caution: {
    viewBox: '0 0 640 640',
    path: 'M320 496C342.1 496 360 513.9 360 536C360 558.1 342.1 576 320 576C297.9 576 280 558.1 280 536C280 513.9 297.9 496 320 496zM320 64C346.5 64 368 85.5 368 112C368 112.6 368 113.1 368 113.7L352 417.7C351.1 434.7 337 448 320 448C303 448 289 434.7 288 417.7L272 113.7C272 113.1 272 112.6 272 112C272 85.5 293.5 64 320 64z'
  },
  warning: {
    viewBox: '0 0 640 640',
    path: 'M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z'
  },
  info: {
    viewBox: '0 0 640 640',
    path: 'M272 112C272 85.5 293.5 64 320 64C346.5 64 368 85.5 368 112C368 138.5 346.5 160 320 160C293.5 160 272 138.5 272 112zM224 256C224 238.3 238.3 224 256 224L320 224C337.7 224 352 238.3 352 256L352 512L384 512C401.7 512 416 526.3 416 544C416 561.7 401.7 576 384 576L256 576C238.3 576 224 561.7 224 544C224 526.3 238.3 512 256 512L288 512L288 288L256 288C238.3 288 224 273.7 224 256z'
  }
}

const getIconPath = (type) => (iconPaths[type] || iconPaths['info'])?.path || null
const getViewBox = (type) => (iconPaths[type] || iconPaths['info'])?.viewBox || null

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
            value: `<svg class="alert-icon" viewBox="${viewBox}" fill="currentColor" aria-hidden="true"><path d="${iconPath}"/></svg>`
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
