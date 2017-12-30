/*
	Allows simplified management of classes using classManager.isApplied(), classManager.add(), classManager.remove(), and classManager.replace().
*/

var classManager =
{
	isApplied : function(target, className)
	{
		var regex = classManager.getRegExp(className);
		return regex.test(target.className);
	},
	
	add : function(target, className)
	{
		// If the class already exists, why bother adding?
		if (classManager.isApplied(target, className))
		{ return target.className; }
					
		if (target.className.length != 0)
		{ target.className += " "; }
		target.className += className;
		
		return target.className;
	},
	
	remove : function(target, className)
	{
		var regex = classManager.getRegExp(className);
		target.className = target.className.replace(regex, "$2");
		
		return target.className;
	},
	
	replace : function(target, oldClass, newClass)
	{
		var regex = classManager.getRegExp(oldClass);
		target.className = target.className.replace(regex, "$1" + newClass + "$2");
	},
	
	getRegExp : function (className)
	{
		/// Allow prior word seperator and subsequent end of line/word seperator to be 
		/// used in remove/replace expressions by assigning them to $1 and $2 respectively.
		return new RegExp("(\\b)" + className + "($|\\b)", "g");
	}
}