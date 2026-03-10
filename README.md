## AI Use
AI assistance was not used to generate this code. All code was written by adapting completed modules from prior lessons and by analyzing the included tests.


## Design
As this project has a strict rubrick and robust unit testing pre-built, it was built to the specifications outlined in the lesson.  Thus, there was little creative adaptation (as it should be when a spec is well outlined).

The API has been designed in this case without a front-end, though a front-end would be simple to design for it. Given more time and resources, this project could and should be extended with a well-designed front-end and a more secure and permanent back-end database.

### Debugging
Debugging was performed by running the app locally to test, as well as reviewing the test code to determine what was being checked for.

### Data integrity
Update handlers have been designed to protect the Id property from being overwritten.
Several validations have been designed (see below section) to help ensure data quality.

### Errors and Edge Cases

#### Error handling
- methodNotAllowed - Used at the end of chained router method calls to ensure any methods not explicitly defined can be executed.
- notFound - Used to return an error for routes not defined in the app, specifically anything other than /dishes and /orders.
- errorHandler - Used as a "catch all" to return 500 if any unhandled error should occur.


#### Validations
Extensive validation has been added in an attempt to cover any edge cases that may occur during the ordering process. These include:
- orderExists - Validates order ID exists
- hasDeliverTo - Ensures deliverTo field is present and not empty
- hasMobileNumber - Ensures mobileNumber field is present and not empty
- hasDishes - Ensures dishes field exists
- dishesIsArray - Validates dishes is an array with at least one item
- dishesHaveQuantity - Ensures each dish has a valid quantity greater than 0
- hasStatus - Ensures status field is present (for updates)
- statusIsValid - Validates status is one of: pending, preparing, out-for-delivery, delivered
- statusIsPending - Ensures order status is pending (for deletes)
- orderIdMatches - Validates ID in request body matches route parameter (for updates)
- dishExists - Ensures a dish exists before ordering
- hasName - Ensures the name field is present and not empty
- hasDescription - Ensures description field is present and not empty
- hasImageUrl - Ensures image_url field is present and not empty
- hasPrice - Ensures price field exists
- priceIsValid - Validates price is a number greater than 0
- dishIdMatches - Validates ID in request body matches route parameter (for updates)

## What I would improve
- Error messages could be more descriptive to users.  Example: "Order must include a deliverTo" could be better written as "Order must include a Deliver To Address."
- Obviously, in a real-world application, this app would be built on a robust back-end. My experience is with Oracle database back-ends, so this is one possible option, though there are may be better and more responsive back-end options available.