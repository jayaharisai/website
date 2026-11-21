/** Learning maps for the topic sidebar, keyed by the topic slug (the part after t= in its href).
 *  One line per box. Each ">" goes one level deeper, and a box hangs from the nearest box above it that is one level shallower.
 *
 *      >> Title: what it is | concept; concept; concept ~ a project to build @slug-of-another-topic
 *
 *  Example:
 *  'machine-learning': `Introduction: What it is. | idea one; idea two ~ A first project.
 *  > Data: Where everything starts. | cleaning; features ~ Clean a CSV.
 *  >> Features: The columns a model reads. | encoding; scaling ~ Add three features.`,
 */
window.LEARNEW_PATHS = {
};
