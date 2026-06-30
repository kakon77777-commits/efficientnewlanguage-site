import { useLang } from '../i18n';
import { CONTENT, type SiteContent } from '../content/site';

/** The active language's content object. */
export function useContent(): SiteContent {
  return CONTENT[useLang().lang];
}
