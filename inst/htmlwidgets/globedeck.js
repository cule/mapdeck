HTMLWidgets.widget({

  name: 'globedeck',
  type: 'output',

  factory: function(el, width, height) {

    return {

      renderValue: function(x) {

      	md_setup_window( el.id );

      	var mapDiv = document.getElementById( el.id );
  			mapDiv.className = 'mapdeckmap';
  			mapDiv.style.backgroundColor = "#FF000080";


        // INITIAL VIEW
        window[el.id + 'INITIAL_VIEW_STATE'] = {
        	longitude: x.location[0],
        	latitude: x.location[1],
        	zoom: x.zoom,
        	maxZoom: x.max_zoom,
       	 	minZoom: x.min_zoom,
       	 	resolution: x.resolution
        };

        const deckgl = new deck.DeckGL({
        	  views: [ new deck._GlobeView({
        	  	id: el.id,
        	  	controller: true,
        	  	farZMultiplier: 2
        	  	}) ],
			      container: el.id,
			      initialViewState: window[el.id + 'INITIAL_VIEW_STATE'],
			      layers: [],
			      parameters: {
			      	cull: x.cull
			      }
			      //controller: true
			      /*
			      //onLayerHover: setTooltip
			      onViewStateChange: ({viewId, viewState, interactionState}) => {

			      	if (!HTMLWidgets.shinyMode && !x.show_view_state ) { return; }
							// as per:
							// https://github.com/uber/deck.gl/issues/3344
							// https://github.com/SymbolixAU/mapdeck/issues/211
			      	const viewport = new deck.WebMercatorViewport(viewState);
  						const nw = viewport.unproject([0, 0]);
  						const se = viewport.unproject([viewport.width, viewport.height]);

  						const w = nw[0] < -180 ? -180 : ( nw[0] > 180 ? 180 : nw[0] );
  						const n = nw[1] < -90 ? -90 : ( nw[1] > 90 ? 90 : nw[1] );

  						const e = se[0] < -180 ? -180 : ( se[0] > 180 ? 180 : se[0] );
  						const s = se[1] < -90 ? -90 : ( se[1] > 90 ? 90 : se[1] );

  						viewState.viewId = viewId;

							viewState.viewBounds = {
  							north: n, //nw[1],
  							east:  e, //se[0],
  							south: s, //se[1],
  							west:  w //nw[0]
  						};
  						viewState.interactionState = interactionState;

  						if( x.show_view_state ) {
  							var vs = JSON.stringify( viewState );
  							//console.log( vs );
  							window[el.id + 'mapViewState'].innerHTML = vs;
  						}

  						if (!HTMLWidgets.shinyMode ) { return; }

						  Shiny.onInputChange(el.id + '_view_change', viewState);
			      },
			      onDragStart(info, event){
			      	if (!HTMLWidgets.shinyMode) { return; }
			      	//if( info.layer !== null ) { info.layer = null; }  // dragging a layer;
			      	info.layer = undefined; // in case of dragging a layer
			      	Shiny.onInputChange(el.id +'_drag_start', info);
			      },
			      onDrag(info, event){
			      	if (!HTMLWidgets.shinyMode) { return; }
			      	//if( info.layer !== null ) { info.layer = null; }  // dragging a layer;
			      	info.layer = undefined; // in case of dragging a layer
			      	Shiny.onInputChange(el.id +'_drag', info);
			      },
			      onDragEnd(info, event){
			      	if (!HTMLWidgets.shinyMode) { return; }
			      	//if( info.layer !== null ) { info.layer = null; }  // dragging a layer;
			      	info.layer = undefined; // in case of dragging a layer
			      	Shiny.onInputChange(el.id +'_drag_end', info);
			      },
			      onResize(size) {
			      	if (!HTMLWidgets.shinyMode) { return; }
			      	Shiny.onInputChange(el.id +'_resize', size);
			      }
			      */
			  });

			  window[el.id + 'map'] = deckgl;

			  md_initialise_map(el, x);
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size
      }
    };
  }
});


if (HTMLWidgets.shinyMode) {

  Shiny.addCustomMessageHandler("globedeckmap-calls", function (data) {

  	//console.log( "mapdeckmap-calls" );

    var id = data.id,   // the div id of the map
      el = document.getElementById(id),
      map = el,
      call = [],
      i = 0;

    if (!map) {
      //console.log("Couldn't find map with id " + id);
      return;
    }

    for (i = 0; i < data.calls.length; i++) {

      call = data.calls[i];

      //push the mapId into the call.args
      call.args.unshift(id);

      if (call.dependencies) {
        Shiny.renderDependencies(call.dependencies);
      }

      if (window[call.method]) {
        window[call.method].apply(window[id + 'map'], call.args);
      } else {
        //console.log("Unknown function " + call.method);
      }
    }
  });
}

