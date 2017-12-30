/*
	Allows cross-browser event management using eventManager.attach() and eventManager.detach(), with eventManager.preventDefault() to stop default execution path. 
	Works with DOM2 browsers, recent IE, and eventManager.attach() _should_ work with older browsers too.
*/

var eventManager =
{
	attach : function(node, eventName, eventHandler)
	{
		eventName = eventName.toLowerCase();
		
		if(node.addEventListener)
		{
			// If the UA supports DOM 2, use .addEventListener()
			node.addEventListener(eventName, eventHandler, false);
		}
		else if (node.attachEvent)
		{
			// If the UA is a recent version of IE, use .attachEvent()
			node.attachEvent("on" + eventName, eventHandler, false);
		}
		else
		{
			// Otherwise, attach the event the old-school way
			eventName = "on" + eventName;
			if(typeof node[eventName] == "function" )
			{
				var oldEvent = node[eventName];
				node[eventName] = function(e)
				{
					oldEvent(e);
					return eventHandler(e);
				}
			}
			else
			{
				node[eventName]=eventHandler;
			}
		}
	},
	
	oldDomDetachException : "Functionality not implemented: Cannot detach event handlers on non-DOM2/IE user agents",
	
	detach : function(node, eventName, eventHandler)
	{
		eventName = eventName.toLowerCase();
		
		if(node.removeEventListener)
		{
			// If the UA supports DOM 2, use .removeEventListener()
			node.removeEventListener(eventName, eventHandler, false);
		}
		else if (node.detachEvent)
		{
			// If the UA is a recent version of IE, use .detachEvent()
			node.detachEvent("on" + eventName, eventHandler, false);
		}
		else
		{
			// TODO: Implement event detaching on non-DOM2/IE UAs
			throw this.oldDomDetachException;
		}
	},
	
	preventDefault : function(e)
	{
		if (e && e.preventDefault)
			e.preventDefault(); // DOM style
		return false; // IE style
	}
}