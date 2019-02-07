Mmenu.addons.setSelected = function(
	this : Mmenu
) {
	var opts = this.opts.setSelected;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		(opts as mmLooseObject) = {
			hover	: opts,
			parent	: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	//	Extend shorthand options


	this.opts.setSelected = Mmenu.extend( opts, Mmenu.options.setSelected );


	//	Find current by URL
	if ( opts.current == 'detect' )
	{
		function findCurrent( 
			this : Mmenu,
			url  : string
		) {
			url = url.split( "?" )[ 0 ].split( "#" )[ 0 ];

			var anchor = this.node.menu.querySelector( 'a[href="'+ url +'"], a[href="'+ url +'/"]' );
			if ( anchor )
			{
				this.setSelected( anchor.parentElement );
			}
			else
			{
				var arr = url.split( '/' ).slice( 0, -1 );
				if ( arr.length )
				{
					findCurrent.call( this, arr.join( '/' ) );
				}
			}
		};
		this.bind( 'initMenu:after', () => {
			findCurrent.call( this, window.location.href );
		});

	}

	//	Remove current selected item
	else if ( !opts.current )
	{
		this.bind( 'initListview:after', ( 
			panel : HTMLElement
		) => {
			Mmenu.DOM.find( panel, '.mm-listitem_selected' )
				.forEach(( listitem ) => {
					listitem.classList.remove( 'mm-listitem_selected' );
				});
		});
	}


	//	Add :hover effect on items
	if ( opts.hover )
	{
		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_selected-hover' );
		});
	}


	//	Set parent item selected for submenus
	if ( opts.parent )
	{
		this.bind( 'openPanel:finish', ( 
			panel : HTMLElement
		) => {
			//	Remove all
			Mmenu.DOM.find( this.node.pnls, '.mm-listitem_selected-parent' )
				.forEach(( listitem ) => {
					listitem.classList.remove( 'mm-listitem_selected-parent' );
				});

			//	Move up the DOM tree
			var parent : HTMLElement = panel[ 'mmParent' ];
			while ( parent )
			{
				if ( !parent.matches( '.mm-listitem_vertical' ) )
				{
					parent.classList.add( 'mm-listitem_selected-parent' );
				}
			
				parent = (parent.closest( '.mm-panel' ) as HTMLElement);
				parent = parent[ 'mmParent' ];
			}
		});

		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_selected-parent' );
		});
	}
};


//	Default options and configuration.
Mmenu.options.setSelected = {
	current : true,
	hover	: false,
	parent	: false
};
