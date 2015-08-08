import Backbone from 'backbone';
import _ from 'underscore';

const linkViewOptions = [
  'href',
  'activeClass',
  'textContent',
  'innerHTML',
  'template'
];

/**
 * Link view for use in Backbone apps.
 *
 * @example
 *
 * let link = new LinkView({
 *   href: 'about',
 *   textContent: 'About'
 * });
 *
 * link.render().$el.appendTo(document.body);
 *
 * @name LinkView
 * @class
 * @extends Backbone.View
 * @memberOf Backbone
 */
export default Backbone.View.extend({

  /**
   * href attribute for the link view element.
   *
   * @type {String|Function}
   */
  href: null,

  /**
   * Active class to use when the link is currently active.
   *
   * @type {String|Function}
   */
  activeClass: 'active',

  /**
   * Set the `textContent` of the views element.
   *
   * @type {String|Function}
   */
  textContent: null,

  /**
   * Set the `innerHTML` of the views element.
   *
   * @type {String|Function}
   */
  innerHTML: null,

  /**
   * Set a template function for the link view to use on render.
   *
   * @type {Function}
   */
  template: null,

  /**
   * Element tagName.
   *
   * @type {String|Function}
   */
  tagName: 'a',

  /**
   * Element attributes.
   *
   * @type {Object|Function}
   * @return {Object}
   */
  attributes() {
    return {
      href: _.result(this, 'href')
    };
  },

  /**
   * Check if the link is currently active.
   *
   * @return {Boolean}
   */
  isActive() {
    return !!this._isActive;
  },

  /**
   * @constructs
   * @param {Object} [options]
   * @param {String|Function} [options.href] Override the link view's href attribute.
   * @param {String|Function} [options.activeClass] Override the link view's active class.
   * @param {String|Function} [options.textContent] Override the link view's text content.
   * @param {String|Function} [options.innerHTML] Override the link view's inner html.
   * @param {Function} [options.template] Override the link view's template function.
   */
  constructor(options) {
    _.extend(this, _.pick(options, linkViewOptions));
    this.listenTo(Backbone.history, 'route', this._onRoute);
    Backbone.View.apply(this, arguments);
  },

  /**
   * DOM event mapping.
   *
   * @type {Object}
   */
  events: {
    click: '_onClick'
  },

  /**
   * Render the link view.
   *
   * @return {LinkView} `this`
   */
  render() {
    if (this.textContent) {
      this.$el.text(_.result(this, 'textContent'));
    } else if (this.innerHTML) {
      this.$el.html(_.result(this, 'innerHTML'));
    } else if (this.template) {
      this.$el.html(this.template());
    }
    return this;
  },

  /**
   * Click event handler.
   *
   * @private
   * @param {Event} e
   */
  _onClick(e) {
    e.preventDefault();
    Backbone.history.navigate(_.result(this, 'href'), {
      trigger: true
    });
  },

  /**
   * Route event handler.
   *
   * @private
   */
  _onRoute() {
    let route = Backbone.history.getFragment();
    let href = _.result(this, 'href');
    let activeClass = _.result(this, 'activeClass');

    if (route === href && !this._isActive) {
      this._isActive = true;
      this.$el.addClass(activeClass);
    } else if (this._isActive) {
      this._isActive = false;
      this.$el.removeClass(activeClass);
    }
  }
});
