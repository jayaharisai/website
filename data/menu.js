/** Site content. Edit here; the navbar, the list pages, the home ticker and the topic pages all read it.
 *
 *  Add a topic to a group's `items`:
 *    { title: 'Machine Learning', tag: 'Foundations', blurb: 'One or two sentences for the card.', desc: 'Short line for the dropdown',
 *      href: 'topic.html?g=Learnings&t=machine-learning',
 *      sections: [ { id: 'overview', title: 'Overview', html: '<p>Your notes.</p>' } ] }
 *  The part after t= in href is the topic's slug. Add art: 'ml' (see ui/navbar) if you want a picture in the dropdown.
 *  Optional `feature` shows a highlighted card in the dropdown:
 *    feature: { art: 'dl', kicker: 'Start here', title: '...', desc: '...', cta: 'Read', href: '...' }
 *  A learning map for the sidebar goes in data/paths.js under the same slug.
 */
window.LEARNEW_MENU = [
  { label: 'Learnings', all: 'learnings.html', items: [] },
  { label: 'Concepts', all: 'concepts.html', items: [] },
];
