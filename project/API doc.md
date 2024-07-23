# DB Schema

	    role: { /** role=99 for admin, role=10 for user **/
            type: Number,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
			required: true
        }

# API Calls
This section listed all implemented API calls.

## Retrieve Locations
Title: Retrieve Locations
HTTP Method: POST
URL: /location
Request Content: None
Response Content:
200 OK: Returns a JSON object containing the location data.
403 Forbidden: If there is an error while retrieving the data.

## Retrieve Events
Title: Retrieve Events
HTTP Method: POST
URL: /event
Request Content: None
Response Content:
200 OK: Returns a JSON array containing the event data.
403 Forbidden: If there is an error while retrieving the data.

## Filter Events
Title: Filter Events
HTTP Method: POST
URL: /eventfilter
Request Content:
filterLowPrice (optional): The lower price limit for filtering events.
filterHighPrice (optional): The higher price limit for filtering events.
Response Content:
200 OK: Returns a JSON array containing the filtered event data.
403 Forbidden: If there is an error while filtering the events.

## Location Detail
Title: Location Detail
HTTP Method: POST
URL: /locationDetail
Request Content:
locationname: The name of the location for which details are requested.
Response Content:
200 OK: Returns a JSON object containing the details of the location.
403 Forbidden: If there is an error while retrieving the location details.

## Add Comment to Location
Title: Add Comment to Location
HTTP Method: PUT
URL: /location/newcomment
Request Content:
venue: The name of the location where the comment is being added.
username: The username of the user adding the comment.
cm: The comment text.
Response Content:
200 OK: Returns the updated data after adding the comment.
404 Not Found: If the location is not found.

## Match Events by Date
Title: Match Events by Date
HTTP Method: POST
URL: /eventdatematch
Request Content:
date: The date for which events are being matched.
Response Content:
200 OK: Returns a JSON array containing the matched event titles.
404 Not Found: If no events are found for the provided date.

## Search Locations by Keyword
Title: Search Locations by Keyword
HTTP Method: POST
URL: /location/keyword
Request Content:
keyword: The keyword to search for in location names.
Response Content:
200 OK: Returns a JSON array containing the locations that match the keyword.
404 Not Found: If no locations match the provided keyword.

## Last Update Time of Profile
Title: Last Update Time of Profile
HTTP Method: POST
URL: /profile/lastUpdateTime
Request Content: None
Response Content:
200 OK: Returns a JSON object containing the last update time of the profile.
404 Not Found: If there is an error while retrieving the last update time.

## Add Admin Event
Title: Add Admin Event
HTTP Method: POST
URL: /adminevent
Request Content:
eventID: The ID of the event being added.
eventTitle: The title of the event.
eventLocation: The location of the event.
eventDate: The date of the event.
eventTime: The time of the event.
eventDescription: The description of the event.
eventPresenter: The presenter of the event.
eventPrice: The price of the event.
Response Content:
201 Created: Returns the newly created event data.
404 Not Found: If there is an error while adding the event.

## Get Admin Event by ID
Title: Get Admin Event by ID
HTTP Method: GET
URL: /adminevent/:id
Request Content: None
Response Content:
200 OK: Returns the event data matching the provided ID.
404 Not Found: If no event is found for the provided ID.

## Update Admin Event
Title: Update Admin Event
HTTP Method: PUT
URL: /adminevent
Request Content:
eventID: The ID of the event being updated.
eventTitle: The updated title of the event.
eventLocation: The updated location of theevent.
eventDate: The updated date of the event.
eventTime: The updated time of the event.
eventDescription: The updated description of the event.
eventPresenter: The updated presenter of the event.
eventPrice: The updated price of the event.
Response Content:
200 OK: Returns the updated event data.
404 Not Found: If there is an error while updating the event.

## Delete Admin Event
Title: Delete Admin Event
HTTP Method: DELETE
URL: /adminevent/:id
Request Content: None
Response Content:
204 No Content: Indicates successful deletion of the event.
404 Not Found: If no event is found for the provided ID.

## Login

    POST /login
Request (JSON object): `{ username, password, rem }` (`rem=1` for remember 30 days, otherwise session-wise)
Response: 

 - Error (No user): `HTTP 403` + plaintext `noUser`
- Error (wrong pwd): `HTTP 403` + plaintext `wrongPassword`
- Success: `HTTP 200` + JSON object `{ role, username }` + cookie (auto)

Note: if the user already logged in, server will automatically check if the login is still valid (i.e. no password change within the login session), and also return success if valid, otherwise initiate normal login checking protocol.
## Create user (Admin)

    POST /user
Request (JSON object): `{ role, username, password }`
Response: 
 - Error (not logged in/ not admin): `HTTP 403` + plaintext `unauthorized`
- Error (user already exists): `HTTP 409` + plaintext `userAlreadyExists`
- Success: `HTTP 201` + plaintext`success`

## Get user (Admin)

    GET /user
Request: `username`
Response: 
 - Error (not logged in/ not admin): `HTTP 403` + plaintext `unauthorized`
- Error (no such user): `HTTP 404` + plaintext `noUser`
- Success: `HTTP 200` + plaintext`$hash$`

## Update user (Admin)

    PUT /user
Request (JSON object): `{ username, password }`
Response: 
 - Error (not logged in/ not admin): `HTTP 403` + plaintext `unauthorized`
- Error (no such user): `HTTP 404` + plaintext `noUser`
- Success: `HTTP 204` + plaintext`success`

## Delete user (Admin)

    DELETE /user
Request (JSON object): `{ username }`
Response: 
 - Error (not logged in/ not admin): `HTTP 403` + plaintext `unauthorized`
- Error (no such user): `HTTP 404` + plaintext `noUser`
- Success: `HTTP 204` + plaintext`success`
