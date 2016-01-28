(function() {

  var template = $('#status').html();
  var statuses = JSON.parse($('#statuses').html());
  var $app = $('#app');

  statuses.forEach(function(status) {
    var $status = $(ejs.render(template, { status: status }));
    $app.append($status);
  });

})();
