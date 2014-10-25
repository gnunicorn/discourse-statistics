
after_initialize do
  require_dependency File.expand_path('../integrate.rb', __FILE__)
end

register_asset "javascripts/discourse/templates/statistics.js.handlebars"
# Do not load the UI directly use sidebar UI instead
# register_asset "javascripts/statistics.js"

register_css <<CSS

.statistics-ui {
  padding: 0;
}

.statistics-ui:after {
  content: " ";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.statistics-ui ul {
  display:inline;
  margin: 5px 0 0 5px;
}

.statistics-ui li {
  display:inline;
  margin: 0;
}

CSS