/**
 * Functions used to parse links and images, split out of parser rules because
 * of their size.
 *
 * @module md.helpers
 */

// Just a shortcut for bulk export

import parseLinkLabel from './parse_link_label.ts'
import parseLinkDestination from './parse_link_destination.ts'
import parseLinkTitle from './parse_link_title.ts'

export {
  parseLinkLabel,
  parseLinkDestination,
  parseLinkTitle
}
