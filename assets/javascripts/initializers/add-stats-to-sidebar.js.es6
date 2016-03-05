
export default {
  name: "add-stats-to-sidebar",

  initialize: function(container, application) {
    if (!Discourse['external:SidebarWidgets']) {
      Discourse['external:SidebarWidgets'] = {};
    }

    Discourse['external:SidebarWidgets']["stats"] = Ember.View.extend({
      templateName: "statistics",
      tagName: "div",
      classNames: ['statistics-ui'],
      classNameBindings: ["shouldBeHidden:hidden"],
      teaser: Discourse.computed.setting('site_teaser'),

      // only show on list pages
      shouldBeHidden: function() {
        if (this.get('url')) {
          return this.get("url") !== "/" && this.get("url").indexOf('/latest') !== 0
            && this.get("url").indexOf('/top/') !== 0 && this.get("url").indexOf('/tag') !== 0
            && this.get("url").indexOf('/unread') !== 0;
        }
      }.property("url"),

      statistics: function() {
        return Discourse.Site.currentProp("statistics");
      }.property(),

      actions: {
        facebookButtonClicked() {
          if (typeof window.ga !== 'undefined') {
            ga('send', 'event', 'Facebook Fan Page', 'click');
          }

          window.open('http://fb.me/werweisswas', '_blank');
        }
      }

    });
  }
};
