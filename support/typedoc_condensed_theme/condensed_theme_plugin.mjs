/*
 * Theme on top of the default one. Page layout and navigation are kept intact,
 * only member presentation is changed:
 *
 * - source link is compact (`Source`) and moved into the signature line;
 * - member `h3` heading is dropped, its anchor moves to the `section`;
 * - permalink is a plain `§` instead of an icon;
 * - own markup for signature and getter/setter lists;
 * - page top keeps the default layout.
 *
 * The only place coupled to TypeDoc's markup is `findMemberSignature`.
 */

import { cpSync } from 'node:fs'
import { join } from 'node:path'

import {
  DefaultTheme,
  DefaultThemeRenderContext,
  i18n,
  JSX,
  ReflectionKind,
  RendererEvent
} from 'typedoc'

const h = JSX.createElement

/* =============================================================================
 * Source links and permalinks
 * ========================================================================== */

function sourceLink (context, source) {
  if (!source.url) return 'Source'

  const attributes = { href: source.url }

  if (context.options.getValue('sourceLinkExternal')) {
    attributes.target = '_blank'
  }

  return h('a', attributes, 'Source')
}

function sourceLinks (context, item) {
  if (!item.sources?.length) return null

  return h('aside', { class: 'tsd-sources' },
    h('ul', null,
      item.sources.map(source => h('li', null, sourceLink(context, source)))
    )
  )
}

// Hide sources for the duration of the default render: TypeDoc skips its own
// source links, but keeps implements/inherited/overrides notes untouched.
function renderWithoutSources (item, render) {
  const saved = item.sources

  item.sources = undefined
  try {
    return render()
  } finally {
    item.sources = saved
  }
}

function anchorIcon (context, anchor) {
  if (!anchor) return h(JSX.Fragment, null)

  return h('a', {
    href: `#${anchor}`,
    'aria-label': i18n.theme_permalink(),
    class: 'tsd-anchor-icon'
  }, context.icons.anchor())
}

function addSignaturePermalink (context, signature, anchor) {
  if (!anchor) return

  signature.props = {
    ...signature.props,
    class: `${signature.props.class} tsd-anchor-link`
  }
  signature.children.push(anchorIcon(context, anchor))
}

// TypeDoc renders the page top bypassing `member`, keep the default look there.
function isPageTop (context, reflection) {
  return reflection === context.page.model
}

// Coupled to TypeDoc's markup: the signature line of `memberDeclaration` output.
function findMemberSignature (element) {
  return element?.children.find(child =>
    child?.props?.class?.split(' ').includes('tsd-signature')
  )
}

/* =============================================================================
 * Signature lists
 * ========================================================================== */

function signatureItem (context, signature, permalinkAnchor, itemClass) {
  const anchor = context.getAnchor(signature)
  const className = [
    context.getReflectionClasses(signature),
    itemClass
  ].filter(Boolean).join(' ')
  const signatureElement = h('div', {
    class: 'tsd-signature',
    id: anchor
  },
  sourceLinks(context, signature),
  context.memberSignatureTitle(signature)
  )

  addSignaturePermalink(context, signatureElement, permalinkAnchor)

  return h('li', className ? { class: className } : null, signatureElement,
    h('div', { class: 'tsd-description' },
      renderWithoutSources(signature, () => context.memberSignatureBody(signature))
    )
  )
}

function signatureList (context, declaration, items) {
  const classes = context.getReflectionClasses(declaration)

  return h('ul', {
    class: classes ? `tsd-signatures ${classes}` : 'tsd-signatures'
  }, items)
}

/* =============================================================================
 * Render context
 * ========================================================================== */

class CondensedThemeRenderContext extends DefaultThemeRenderContext {
  constructor (...args) {
    super(...args)

    // In TypeDoc these renderers are fields, not prototype methods, so `super`
    // can't reach them: overrides that augment the output capture the original
    // here, while a full replacement is declared as a class field.
    const renderMember = this.member
    const renderMemberDeclaration = this.memberDeclaration
    const renderMemberSignatures = this.memberSignatures
    const renderMemberSources = this.memberSources

    this.memberSources = item => h(JSX.Fragment, null,
      sourceLinks(this, item),
      renderWithoutSources(item, () => renderMemberSources(item))
    )

    this.memberDeclaration = declaration => {
      if (isPageTop(this, declaration)) return renderMemberDeclaration(declaration)

      const element = renderWithoutSources(declaration, () => renderMemberDeclaration(declaration))
      const signature = findMemberSignature(element)

      if (!signature) return element

      const sources = sourceLinks(this, declaration)

      if (sources) signature.children.unshift(sources)
      addSignaturePermalink(this, signature, this.getAnchor(declaration))

      return element
    }

    this.memberSignatures = declaration => {
      if (isPageTop(this, declaration)) return renderMemberSignatures(declaration)

      return signatureList(this, declaration, declaration.signatures?.map((signature, index) =>
        signatureItem(
          this,
          signature,
          index === 0 && this.getAnchor(declaration),
          signature.kind === ReflectionKind.CallSignature && 'cndnsd-call-signature'
        )
      ))
    }

    this.member = item => {
      const element = renderMember(item)
      const anchor = this.getAnchor(item)

      element.children = element.children.filter(child => child?.tag !== 'h3')
      element.props = { ...element.props, id: anchor }

      return element
    }
  }

  get icons () {
    return {
      ...super.icons,
      anchor: () => h('span', {
        'aria-hidden': 'true',
        class: 'cndnsd-anchor-symbol'
      }, '§')
    }
  }

  memberGetterSetter = declaration => signatureList(this, declaration, [
    declaration.getSignature && signatureItem(
      this,
      declaration.getSignature,
      this.getAnchor(declaration)
    ),
    declaration.setSignature && signatureItem(
      this,
      declaration.setSignature,
      !declaration.getSignature && this.getAnchor(declaration)
    )
  ])
}

/* =============================================================================
 * Theme and plugin
 * ========================================================================== */

class CondensedTheme extends DefaultTheme {
  ContextClass = CondensedThemeRenderContext

  constructor (renderer) {
    super(renderer)

    this.owner.on(RendererEvent.END, event => {
      cpSync(
        join(import.meta.dirname, 'condensed_theme.css'),
        join(event.outputDirectory, 'assets', 'condensed_theme.css')
      )
    })
  }
}

export default function condensedThemePlugin (app) {
  app.renderer.hooks.on('head.end', context => h('link', {
    rel: 'stylesheet',
    href: context.relativeURL('assets/condensed_theme.css')
  }))

  app.renderer.defineTheme('condensed', CondensedTheme)
}
