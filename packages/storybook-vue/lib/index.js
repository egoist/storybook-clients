'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStorybook = exports.configure = exports.addDecorator = exports.setAddon = exports.storiesOf = undefined;

var _preview = require('./preview');

var previewApi = _interopRequireWildcard(_preview);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var storiesOf = exports.storiesOf = previewApi.storiesOf; // import deprecate from 'util-deprecate';

// NOTE export these to keep backwards compatibility
// import { action as deprecatedAction } from '@storybook/addon-actions';
// import { linkTo as deprecatedLinkTo } from '@storybook/addon-links';

var setAddon = exports.setAddon = previewApi.setAddon;
var addDecorator = exports.addDecorator = previewApi.addDecorator;
var configure = exports.configure = previewApi.configure;
var getStorybook = exports.getStorybook = previewApi.getStorybook;

// export const action = deprecate(
//   deprecatedAction,
//   '@storybook/react action is deprecated. See: https://github.com/storybooks/storybook/tree/master/addons/actions'
// );

// export const linkTo = deprecate(
//   deprecatedLinkTo,
//   '@storybook/react linkTo is deprecated. See: https://github.com/storybooks/storybook/tree/master/addons/links'
// );