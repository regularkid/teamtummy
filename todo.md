----- TODO -----
Add function to get cookie value on client
Display total number of tummies on meal page
Display total number of veggie tummies on meal page
Send e-mail to invite list on creation
Add button for "Food's here" on meal page if you are creator
Send e-mail to invite list when "Food's here" is pressed
Add "Yum" sfx when you create a meal or a tummy
Strip tags from all inputs
Display new tummy form if you aren't already on the list
Add delete option to tummy if you are on the list
Add delete server logic
Use cookies to auto fill fields
Add refresh button to meal page (with note saying "Don't worry, we'll auto refresh every 1 minute")
Allow anyone to press "Food's Here" button (with a note saying "Please be careful, this will e-mail everyone who has signed up")?
Add "past cuttoff" display for meal page
Disable "Add tummy" form if past cuttoff time
Export to GitHub
Seperate new tummy form from tummies display (so I can re-enable 15sec update interval)

----- DONE -----
Use mealId instead of name for meal page query
Use mealId instead of name for tummy info
Set cookie for creating a meal (meal ID as key, value = meal name)
Set cookie for creating a tummy (user ID as key, value = tummy name)
Add meal type to meal info
Add meal cutoff time to meal info
Add e-mail invite list to meal info
Change cookie expiration time to 7 days
Create email account to use for mail
Change "GetTummies" to return JSON and let javascript create HTML
Add veggie option to tummy info
Add special requests to tummy info
Format new tummy form nicely
Add new tummy button image
Display meal type on meal page
Display meal cutoff time on meal page
Display "Nobody yet..." in table if no tummies exist yet for a meal
Validate all input fields