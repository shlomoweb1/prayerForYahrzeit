const LOGICAL_PROP_SUGGESTIONS = [
  [/^pl-/, 'ps- (padding-inline-start)'],
  [/^pr-/, 'pe- (padding-inline-end)'],
  [/^ml-/, 'ms- (margin-inline-start)'],
  [/^mr-/, 'me- (margin-inline-end)'],
  [/^border-l(-|$)/, 'border-s- (border-inline-start)'],
  [/^border-r(-|$)/, 'border-e- (border-inline-end)'],
  [/^rounded-l(-|$)/, 'rounded-s- (border-start-start/end radius)'],
  [/^rounded-r(-|$)/, 'rounded-e- (border-end-start/end radius)'],
  [/^rounded-tl(-|$)/, 'rounded-ss-'],
  [/^rounded-tr(-|$)/, 'rounded-se-'],
  [/^rounded-bl(-|$)/, 'rounded-es-'],
  [/^rounded-br(-|$)/, 'rounded-ee-'],
  [/^left-/, 'start- (inset-inline-start)'],
  [/^right-/, 'end- (inset-inline-end)'],
  [/^inset-x/, 'inset-inline'],
  [/^text-left/, 'text-start'],
  [/^text-right/, 'text-end'],
  [/^float-left/, 'float-start'],
  [/^float-right/, 'float-end'],
]

function findViolations(value) {
  const tokens = value.match(/[\w-]+/g) ?? []
  const violations = []
  for (const token of tokens) {
    for (const [pattern, suggestion] of LOGICAL_PROP_SUGGESTIONS) {
      if (pattern.test(token)) {
        violations.push({ token, suggestion })
        break
      }
    }
  }
  return violations
}

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce logical CSS properties (ps/pe/ms/me/start/end) in className strings so the UI is RTL-safe by construction',
      category: 'Stylistic Issues',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      physicalProp:
        'Physical CSS property "{{token}}" in className breaks RTL. Use {{suggestion}} instead.',
    },
  },
  create(context) {
    function checkClassValue(node, value) {
      if (typeof value !== 'string') return
      const violations = findViolations(value)
      for (const { token, suggestion } of violations) {
        context.report({
          node,
          messageId: 'physicalProp',
          data: { token, suggestion },
        })
      }
    }

    function checkAttribute(node) {
      if (node.name.type !== 'JSXIdentifier') return
      if (!/^class/i.test(node.name.name)) return
      if (!node.value) return
      if (node.value.type === 'Literal') {
        checkClassValue(node.value, node.value.value)
      }
    }

    function checkExpressionContainer(node) {
      if (!node.parent || node.parent.type !== 'JSXAttribute') return
      if (node.parent.name.type !== 'JSXIdentifier') return
      if (!/^class/i.test(node.parent.name.name)) return
      if (node.expression.type === 'Literal') {
        checkClassValue(node.expression, node.expression.value)
      } else if (node.expression.type === 'TemplateLiteral') {
        const isDynamic = node.expression.expressions.length > 0
        const staticText = node.expression.quasis.map((q) => q.value.cooked ?? '').join('')
        if (!isDynamic || staticText) {
          checkClassValue(node.expression, staticText)
        }
      }
    }

    return {
      JSXAttribute: checkAttribute,
      JSXExpressionContainer: checkExpressionContainer,
    }
  },
}

export default {
  rules: {
    'logical-props': rule,
  },
}
