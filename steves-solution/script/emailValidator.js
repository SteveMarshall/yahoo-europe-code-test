/*
Applies basic e-mail validation to all inputs with class="email" on all forms within the current page.
Relies on classManager.js and eventManager.js.
*/

var emailValidator = 
{
	initialise : function()
	{
		/// Apply email validation to each form in the page.
		var forms = document.getElementsByTagName("form");
		for (var i = 0, currentForm; currentForm = forms[i]; i++)
		{
			eventManager.attach(currentForm, "submit", emailValidator.validate);
		}
	},
	/*This emailValidator isn't perfect, but it works for most stuff; 
	for starters, it doesn't handle IP-based e-mails... 
	Also, it seems to match some obvious no-nos like ' '*/
	regex : /^[-_.a-z0-9]+@(([-_a-z0-9]+\.)+([A-Za-z]{2,}))$/i,
	invalidWarning : "This email address is invalid.",
	repeatErrorHeader : "This form cannot be submitted because: \n",
	
	validate : function(e)
	{
		var targetNode = e.target ? e.target : e.srcElement;
		var inputs = targetNode.getElementsByTagName("input");
		var invalidEmails = new Array();
		var repeatErrors, firstError;
		
		// Check each input for valid email addresses if it's got a class of email applied.
		for(var i = 0, currentInput; currentInput = inputs[i]; i++)
		{
			if (!classManager.isApplied(currentInput, "email") ||
				((currentInput.getAttribute("type") != null) &&
				(currentInput.getAttribute("type").toLowerCase() != "text")))
			{ continue; }
			
			// We've got an input whose className contains \bemail\b and whose 
			// type is text (or null, which defaults to text), so check it for validity.
			if(currentInput.value.match(emailValidator.regex))
			{
				
				continue;
			}
			
			// Add the invalid e-mail to our array
			invalidEmails[invalidEmails.length] = currentInput;
		}
		
		for(var i in invalidEmails)
		{
			var invalidEmail = invalidEmails[i];
			var parentNode = invalidEmail.parentNode;
			
			if (invalidEmail.id &&
				emailValidator.getLabelForId(invalidEmail.id))
			{
				// If we can find a label for the current input, we should add the 
				// error there to increase accessibility.
				parentNode = emailValidator.getLabelForId(invalidEmail.id);
			}
			
			var strongElements = parentNode.getElementsByTagName("strong");
			
			// Try to find an error for this input in case the user is click-happy.
			for (var j = 0, currentStrong; currentStrong = strongElements[j]; j++)
			{
				// If this isn't an error element, skip it outright.
				if (!classManager.isApplied(currentStrong, "error"))
				{ continue; }
				
				// If this element isn't using the emailWarning or is referencing 
				// a different element, skip it.
				var message = currentStrong.innerText ? currentStrong.innerText : currentStrong.textContent;
				if ((message != emailValidator.invalidWarning) ||
					(!currentStrong.errorSource) ||
					(currentStrong.errorSource != invalidEmail))
				{ continue; }
					
				// This element’s error is already listed so we can skip it. 
				// Keep it’s information for later use, though.
				if (!repeatErrors)
				{
					repeatErrors = message;
					firstError = invalidEmail;
				}
				else
				{ repeatErrors += "\n" + message; }
				var isAlreadyListed = true;
				break;
			}

			if (isAlreadyListed)
			{ continue; }
				
			// Build the error element
			var errorElement = document.createElement("strong");
			classManager.add(errorElement, "error");
			
			var textNode = document.createTextNode(emailValidator.invalidWarning);
			errorElement.errorSource = invalidEmail;
			errorElement.appendChild(textNode);
			
			// Add the element to the appropriate location.
			if (parentNode == invalidEmail.parentNode)
			{
				parentNode.insertBefore(errorElement, invalidEmail);
			}
			else
			{
				parentNode.appendChild(errorElement);
			}
		}

		// If the email address is invalid, stop the user from going anywhere
		if (invalidEmails.length > 0)
		{
			if (repeatErrors)
			{
				// The user’s seen this error before, so make it more obvious 
				// why things aren’t working.
				alert(emailValidator.repeatErrorHeader + repeatErrors);
				firstError.focus();
			}
			return eventManager.preventDefault(e);
		}
		
	},
	
	getLabelForId : function(id)
	{
		var labels = document.getElementsByTagName("label");
		
		for(var i = 0, currentLabel; currentLabel = labels[i]; i++)
		{
			if (!currentLabel.getAttribute("for") ||
				(currentLabel.getAttribute("for") != id))
			{ continue; }
			
			return currentLabel;
		}
	}
}

eventManager.attach(window, "load", emailValidator.initialise);