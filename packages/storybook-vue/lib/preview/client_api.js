'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-underscore-dangle: 0 */

var ClientApi = function () {
  function ClientApi(_ref) {
    var channel = _ref.channel,
        storyStore = _ref.storyStore;
    (0, _classCallCheck3.default)(this, ClientApi);

    // channel can be null when running in node
    // always check whether channel is available
    this._channel = channel;
    this._storyStore = storyStore;
    this._addons = {};
    this._globalDecorators = [];
  }

  (0, _createClass3.default)(ClientApi, [{
    key: 'setAddon',
    value: function setAddon(addon) {
      this._addons = (0, _extends3.default)({}, this._addons, addon);
    }
  }, {
    key: 'addDecorator',
    value: function addDecorator(decorator) {
      this._globalDecorators.push(decorator);
    }
  }, {
    key: 'clearDecorators',
    value: function clearDecorators() {
      this._globalDecorators = [];
    }
  }, {
    key: 'storiesOf',
    value: function storiesOf(kind, m) {
      var _this = this;

      if (!kind && typeof kind !== 'string') {
        throw new Error('Invalid or missing kind provided for stories, should be a string');
      }

      if (!m) {
        // eslint-disable-next-line no-console
        console.warn('Missing \'module\' parameter for story with a kind of \'' + kind + '\'. It will break your HMR');
      }

      if (m && m.hot) {
        m.hot.dispose(function () {
          _this._storyStore.removeStoryKind(kind);
        });
      }

      var localDecorators = [];
      var api = {
        kind: kind
      };

      // apply addons
      (0, _keys2.default)(this._addons).forEach(function (name) {
        var addon = _this._addons[name];
        api[name] = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          addon.apply(api, args);
          return api;
        };
      });

      var createWrapperComponent = function createWrapperComponent(Target) {
        return {
          functional: true,
          render: function render(h, c) {
            return h(Target, c.data, c.children);
          }
        };
      };

      api.add = function (storyName, getStory) {
        if (typeof storyName !== 'string') {
          throw new Error('Invalid or missing storyName provided for a "' + kind + '" story.');
        }

        if (_this._storyStore.hasStory(kind, storyName)) {
          throw new Error('Story of "' + kind + '" named "' + storyName + '" already exists');
        }

        // Wrap the getStory function with each decorator. The first
        // decorator will wrap the story function. The second will
        // wrap the first decorator and so on.
        var decorators = [].concat(localDecorators, (0, _toConsumableArray3.default)(_this._globalDecorators));

        var getDecoratedStory = decorators.reduce(function (decorated, decorator) {
          return function (context) {
            var story = function story() {
              return decorated(context);
            };
            var decoratedStory = decorator(story, context);
            decoratedStory.components = decoratedStory.components || {};
            decoratedStory.components.story = createWrapperComponent(story());
            return decoratedStory;
          };
        }, getStory);

        // Add the fully decorated getStory function.
        _this._storyStore.addStory(kind, storyName, getDecoratedStory);
        return api;
      };

      api.addDecorator = function (decorator) {
        localDecorators.push(decorator);
        return api;
      };

      return api;
    }
  }, {
    key: 'getStorybook',
    value: function getStorybook() {
      var _this2 = this;

      return this._storyStore.getStoryKinds().map(function (kind) {
        var stories = _this2._storyStore.getStories(kind).map(function (name) {
          var render = _this2._storyStore.getStory(kind, name);
          return { name: name, render: render };
        });
        return { kind: kind, stories: stories };
      });
    }
  }]);
  return ClientApi;
}();

exports.default = ClientApi;