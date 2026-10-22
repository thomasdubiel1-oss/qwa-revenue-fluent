export function scoutHead(section: string) {
  const title = `${section} — QWA Demand Scout`;
  const description = 'QWA Revenue Intelligence: explainable demand signals, human-reviewed opportunities, and simulated outreach. Internal demo workspace.';
  return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow, noarchive' }] };
}
