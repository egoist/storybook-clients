'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n        Did you forget to return the Vue component from the story?\n        Use "() => ({ template: \'<my-comp></my-comp>\' })" or "() => ({ components: MyComp, template: \'<my-comp></my-comp>\' })" when defining the story.\n      '], ['\n        Did you forget to return the Vue component from the story?\n        Use "() => ({ template: \'<my-comp></my-comp>\' })" or "() => ({ components: MyComp, template: \'<my-comp></my-comp>\' })" when defining the story.\n      ']);

exports.renderError = renderError;
exports.renderException = renderException;
exports.renderMain = renderMain;
exports.default = renderPreview;

var _commonTags = require('common-tags');

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _ErrorDisplay = require('./ErrorDisplay.vue');

var _ErrorDisplay2 = _interopRequireDefault(_ErrorDisplay);

var _NoPreview = require('./NoPreview.vue');

var _NoPreview2 = _interopRequireDefault(_NoPreview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = console;
var previousKind = '';
var previousStory = '';
var app = null;
var err = null;

function renderErrorDisplay(error) {
  if (err) err.$destroy();

  err = new _vue2.default({
    el: '#error-display',
    render: function render(h) {
      return h('div', { attrs: { id: 'error-display' } }, error ? [h(_ErrorDisplay2.default, { props: { message: error.message, stack: error.stack } })] : []);
    }
  });
}

function renderError(error) {
  renderErrorDisplay(error);
}

function renderException(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  renderErrorDisplay(error);

  // Log the stack to the console. So, user could check the source code.
  logger.error(error.stack);
}

function renderRoot(options) {
  if (err) {
    renderErrorDisplay(null); // clear
    err = null;
  }

  if (app) app.$destroy();

  app = new _vue2.default(options);
}

function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return;

  var selectedKind = data.selectedKind,
      selectedStory = data.selectedStory;


  var story = storyStore.getStory(selectedKind, selectedStory);

  // Unmount the previous story only if selectedKind or selectedStory has changed.
  // renderMain() gets executed after each action. Actions will cause the whole
  // story to re-render without this check.
  //    https://github.com/storybooks/react-storybook/issues/116
  if (selectedKind !== previousKind || previousStory !== selectedStory) {
    // We need to unmount the existing set of components in the DOM node.
    // Otherwise, React may not recrease instances for every story run.
    // This could leads to issues like below:
    //    https://github.com/storybooks/react-storybook/issues/81
    previousKind = selectedKind;
    previousStory = selectedStory;
  } else {
    return;
  }

  var context = {
    kind: selectedKind,
    story: selectedStory
  };

  var component = story ? story(context) : _NoPreview2.default;

  if (!component) {
    var error = {
      message: 'Expecting a Vue component from the story: "' + selectedStory + '" of "' + selectedKind + '".',
      stack: (0, _commonTags.stripIndents)(_templateObject)
    };
    renderError(error);
  }

  renderRoot({
    el: '#root',
    render: function render(h) {
      return h('div', { attrs: { id: 'root' } }, [h(component)]);
    }
  });
}

function renderPreview(_ref) {
  var reduxStore = _ref.reduxStore,
      storyStore = _ref.storyStore;

  var state = reduxStore.getState();
  if (state.error) {
    return renderException(state.error);
  }

  try {
    return renderMain(state, storyStore);
  } catch (ex) {
    return renderException(ex);
  }
}