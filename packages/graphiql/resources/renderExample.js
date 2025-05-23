'use no memo';

/* global React, ReactDOM, GraphiQL */

/**
 * UMD GraphiQL Example
 *
 * This is a simple example that provides a primitive query string parser on top of GraphiQL props
 * It assumes a global umd GraphiQL, which would be provided by an index.html in the default example
 *
 * It is used by:
 * - the netlify demo
 * - end-to-end tests
 * - vite dev server
 */

// Parse the search string to get url parameters.
const parameters = Object.fromEntries(
  new URLSearchParams(location.search).entries(),
);

// When the query and variables string is edited, update the URL bar so
// that it can be easily shared.
function onEditQuery(newQuery) {
  parameters.query = newQuery;
  updateURL();
}

function onEditVariables(newVariables) {
  parameters.variables = newVariables;
  updateURL();
}

function onEditHeaders(newHeaders) {
  parameters.headers = newHeaders;
  updateURL();
}

function onTabChange(tabsState) {
  const activeTab = tabsState.tabs[tabsState.activeTabIndex];
  parameters.query = activeTab.query;
  parameters.variables = activeTab.variables;
  parameters.headers = activeTab.headers;
  updateURL();
}

function confirmCloseTab(index) {
  // eslint-disable-next-line no-alert
  return confirm(`Are you sure you want to close tab with index ${index}?`);
}

function updateURL() {
  const newSearch = Object.entries(parameters)
    .filter(([_key, value]) => value)
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + '=' + encodeURIComponent(value),
    )
    .join('&');
  history.replaceState(null, null, `?${newSearch}`);
}

function getSchemaUrl() {
  const isDev = /localhost$/.test(location.hostname);

  if (isDev) {
    return '/graphql';
  }
  return '/.netlify/functions/graphql';
}

// Render <GraphiQL /> into the body.
// See the README in the top level of this module to learn more about
// how you can customize GraphiQL by providing different values or
// additional child elements.
const root = ReactDOM.createRoot(document.getElementById('graphiql'));
const graphqlVersion = GraphiQL.GraphQL.version;

root.render(
  React.createElement(GraphiQL, {
    fetcher: GraphiQL.createFetcher({
      url: getSchemaUrl(),
      subscriptionUrl: 'ws://localhost:8081/subscriptions',
    }),
    query: parameters.query,
    variables: parameters.variables,
    headers: parameters.headers,
    defaultHeaders: parameters.defaultHeaders,
    onEditQuery,
    onEditVariables,
    onEditHeaders,
    defaultEditorToolsVisibility: true,
    isHeadersEditorEnabled: true,
    shouldPersistHeaders: true,
    inputValueDeprecation: !graphqlVersion.includes('15.5'),
    confirmCloseTab:
      parameters.confirmCloseTab === 'true' ? confirmCloseTab : undefined,
    onTabChange,
    forcedTheme: parameters.forcedTheme,
    defaultQuery: parameters.defaultQuery,
    defaultTheme: parameters.defaultTheme,
  }),
);
