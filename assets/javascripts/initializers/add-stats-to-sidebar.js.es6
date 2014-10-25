
export default {
  name: "add-stats-to-sidebar",

  initialize: function(container, application) {
    if (!Discourse['external:SidebarWidgets']){
        Discourse['external:SidebarWidgets'] = {};
    }

    Discourse['external:SidebarWidgets']["stats"] = Ember.View.extend({
            templateName: "statistics",
            tagName: "div",
            classNames: ['statistics-ui'],
            classNameBindings: ["shouldBeHidden:hidden"],

            // only show on list pages
            shouldBeHidden: function(){
                return (this.get("currentControllerName") || "").indexOf("discovery") === -1;
            }.property("currentControllerName"),

            statistics: function() {
                return Discourse.Site.currentProp("statistics");
            }.property()
        });
    }
};