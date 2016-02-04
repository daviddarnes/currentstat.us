(function() {

  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  var App, Pagination, StatusGrid, Search, Status;

  Status = (function() {
    function Status(data) {
      // a root element is setup, a template to mix with the data later on
      // and it's intial load state are set
      this.$el = undefined;
      this.template = $('#status').html();
      this.data = data;
      this.loaded = false;
    }

    Status.prototype.render = function() {
      // this compiles the template along with it's own set of data
      // other dom elements are stored by reference
      // and the root element is returned so it can be added to the DOM
      this.$el = $( ejs.render(this.template, { status: this.data }) );
      this.$loader = this.$el.find('[data-status-loader]');
      return this.$el;
    };

    Status.prototype.update = function() {
      // update will typically be called when the page is scrolled
      // this will check if the status is inside the viewport and not yet loaded
      // if so, it will then load the gif
      // thus if statuses are added outside of the viewport, images won't be loaded
      if (this.inside_viewport() && !this.loaded) {
        this.load();
      }
    };

    Status.prototype.load = function() {
      // this will load in a new image asynchronously
      // it sets loaded to true to stop this being called multiple times
      // and hides the status' loader once the image is finished loading
      this.loaded = true;
      var image = new Image();
      image.onload = function() {
        this.$el.css('backgroundImage', 'url(' + this.data.image + ')');
        this.$loader.hide();
      }.bind(this);
      image.src = this.data.image;
    };

    Status.prototype.inside_viewport = function() {
      // this checks if the top of root element is within the viewport
      var status_position = this.$el.position().top;
      var window_position = $(window).height() + $(window).scrollTop();
      return status_position <= window_position;
    };

    return Status;
  })();

  Search = (function() {
    function Search($el, statuses) {
      this.input_changed = bind(this.input_changed, this);
      this.statuses = statuses;
      this.$el = $el;
      this.$input = this.$el.find('input');
      this.events();
    }

    Search.prototype.events = function() {
      this.$input.on('keyup', this.input_changed);
    };

    Search.prototype.input_changed = function() {
      var search_term = this.$input.val();
      console.log( this.get_results(search_term) );
    };

    Search.prototype.get_results = function(term) {
      var results = [];

      this.statuses.forEach(function(status) {
        var regex = new RegExp(status);
        if (status.name.search(term) > -1) {
          results.push(status.name);
        }
      });

      return results;
    };

    return Search;
  })();

  Pagination = (function() {
    function Pagination(data, callback) {
      this.data = data;
      this.callback = callback;
      this.page = 0;
      this.loading = false;
      this.per_page = 3;
    }

    Pagination.prototype.initialize = function() {
      this.per_page = 8;
      this.load();
      this.per_page = 3;
    };

    Pagination.prototype.next_page = function() {
      // increase the page number and load new JSONs
      this.page = this.page + 1;
      this.load();
    };

    Pagination.prototype.load = function() {
      // set loading to true so this isn't spammed
      this.loading = true;

      if (this.data.length > 0) {

        // chop the per page limit from the data and hand them to the callback
        var statuses = this.data.splice(0, (this.per_page));
        this.callback(statuses);

        this.loading = false;
      } else {
        $('.pagination-loader').text('no gifs left :(');
      }
    };

    return Pagination;
  })();

  StatusGrid = (function() {
    function StatusGrid($el) {
      // these functions are binded as they can be called out of this scope
      this.update = bind(this.update, this);
      this.render = bind(this.render, this);
      this.reset = bind(this.reset, this);

      // the root element of the grid is set, a new Pagination instance
      // an array of statuses and events are setup
      this.$el = $el;

      var statuses = JSON.parse($('#statuses').html());

      this.pagination = new Pagination(statuses.slice(0), this.render);
      this.search = new Search($('[data-search]'), statuses.slice(0));

      this.statuses = [];
      this.events();
    }

    StatusGrid.prototype.initialize = function() {
      this.pagination.initialize();
    };

    StatusGrid.prototype.events = function() {
      // when the window is scrolled, update all the statuses
      $(window).on('scroll', this.update);
    };

    StatusGrid.prototype.render = function(statuses) {
      // this takes all the new status objects
      // turns them into a new Status instance
      // renders them, and adds them to an internal array and the DOM
      statuses.forEach(function(data) {
        var status = new Status(data);
        this.$el.append(status.render());
        this.statuses.push(status);
      }.bind(this));

      // update is called to check if any new statuses need their images loading
      this.update();
    };

    StatusGrid.prototype.update = function() {
      // loop through all the statuses and nudge them to see if their image needs loading
      this.statuses.forEach(function(status) {
        status.update();
      });

      // if we're not already loading new statuses, check to see if we can
      if (!this.pagination.loading) {
        // if the user has scrolled roughly to the bottom of the page
        // load the next page
        var scroll_position = $(window).scrollTop() + $(window).height();
        var scroll_load_position = $(document).height() - 30; // magic number = height of .pagination-loader

        if(scroll_position > scroll_load_position) {
          this.pagination.next_page();
        }
      }
    };

    return StatusGrid;
  })();


  App = (function() {
    function App($el) {
      // store a reference to the root element
      this.$el = $el;

      // create a new status grid
      this.status_grid = new StatusGrid(this.$el.find('[data-status-grid]'));
      this.status_grid.initialize();
    }

    return App;
  })();

  $(document).ready(function() {
    var app = new App($('[data-app]'));
  });

})();
