Ember.Handlebars.helper('digitGrouping', function(number) {
  number = parseFloat(number);
  return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + '.');
}, 'number');
