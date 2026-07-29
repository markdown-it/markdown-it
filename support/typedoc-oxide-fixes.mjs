import * as fs from 'fs/promises'
import * as path from 'path'
import { deflateSync as deflate, inflateSync as inflate } from 'zlib'
import { RendererEvent, PageEvent, ReflectionKind } from 'typedoc'
import { itemSlug } from 'typedoc-theme-oxide/dist/plugin/context/utils.js'

// Workarounds for https://github.com/balthild/typedoc-theme-oxide - drop them
// once the theme fixes the issues upstream.
export function load (app) {
  app.renderer.on(RendererEvent.BEGIN, (event) => {
    for (const refl of Object.values(event.project.reflections)) {
      // The theme renders `categories` and `groups` side by side, ignoring
      // `navigation.includeCategories`, so everything shows up twice. Drop the
      // groups wherever categories exist; members without categories (class
      // properties, methods, ...) keep their groups.
      if (refl.categories?.length && refl.groups?.length) refl.groups = undefined

      // The theme appends default values right after the type with no
      // separator ("boolean" + "false"). Carry the separator in the value.
      if (refl.defaultValue && !refl.kindOf(ReflectionKind.SomeType)) {
        refl.defaultValue = ' = ' + refl.defaultValue
      }
    }
  })

  // The theme builds its own "Source" and navigation links, ignoring
  // `sourceLinkExternal`. Markdown links are already handled by TypeDoc.
  const baseUrl = app.options.getValue('hostedBaseUrl')

  app.renderer.on(PageEvent.END, (page) => {
    page.contents = page.contents.replace(/<a\s[^>]*>/g, tag => {
      if (/\btarget=/.test(tag)) return tag
      const href = tag.match(/\shref="(https?:\/\/[^"]*)"/)?.[1]
      if (!href || (href + '/').startsWith(baseUrl)) return tag
      return tag.replace(/^<a\s/, '<a target="_blank" ')
    })
  })

  // The theme emits its own member anchors ("property.core") but leaves the
  // router on TypeDoc's scheme ("core"), so every {@link} into a member lands
  // nowhere. Teach the router the anchors the theme actually prints.
  const routerName = app.options.getValue('router')
  const OxideRouter = app.renderer.routers.get(routerName)

  app.renderer.routers.set(routerName, class extends OxideRouter {
    createAnchor (target) { return itemSlug(target) }
  })

  const OxideTheme = app.renderer.themes.get('oxide')

  class PatchedOxideTheme extends OxideTheme {
    getRenderContext (page) {
      const context = super.getRenderContext(page)
      const itemLink = context.itemLink.bind(context)
      const navigation = context.navigation.bind(context)

      // The theme links functions, variables, type aliases and documents to an
      // anchor on the parent page, but only classes, interfaces and namespaces
      // ever get one. Link to the own page whenever the router made one.
      context.itemLink = (item, forceNested) => (
        this.router.hasOwnDocument(item) ? context.urlTo(item) : itemLink(item, forceNested)
      )

      context.navigation = (...args) => {
        const fragment = navigation(...args)

        for (const child of fragment.children) {
          // Drop the hardcoded "Exports" link at the top of the sidebar - it is
          // the only bare <ul> there, everything else is wrapped in <section>.
          child.children = child.children.filter(x => x?.tag !== 'ul')

          // The theme lists the sibling modules of the parent, rustdoc style.
          // On a namespace page that is useful navigation, anywhere else it
          // just glues the project namespaces on top. Keep the ".." link only.
          if (args[0]?.model?.kindOf(ReflectionKind.SomeModule)) continue

          for (const section of child.children.filter(x => x?.tag === 'section')) {
            for (const list of section.children) {
              list.children = list.children
                .flat(Infinity)
                .filter(x => x?.props?.class === 'parent-module')
            }
          }
        }

        return fragment
      }

      return context
    }

    // The search index is built with the same broken links as the sidebar, but
    // by a private method. Repoint its entries once it has been written.
    async postRender (event) {
      await super.postRender(event)

      const file = path.join(event.outputDirectory, 'assets', 'oxide', 'search-index.deflate')
      const parts = JSON.parse(inflate(await fs.readFile(file)).toString())

      for (const part of Object.values(parts)) {
        if (!Array.isArray(part)) continue
        for (const entry of part) {
          const doc = Array.isArray(entry) ? entry[1] : null
          if (typeof doc?.url !== 'string') continue
          const refl = event.project.getReflectionById(doc.id)
          if (refl && this.router.hasOwnDocument(refl)) doc.url = this.router.getFullUrl(refl)
        }
      }

      await fs.writeFile(file, deflate(Buffer.from(JSON.stringify(parts))))
    }
  }

  app.renderer.themes.set('oxide', PatchedOxideTheme)
}
