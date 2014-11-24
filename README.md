#IFrame Host/Client (IFHC 1.0.1)#

##Introduction##
This is a research app to allow different Single Page Applications (SPA) be able to reside in harmony on a single browser window.

###Implementation###
The purposed implementation is to create a mock "host/client" network.  

Each client SPA will be loaded into the host browser window as an IFrame - a special JS library is used to to bridge the communication of the SPA client(s) and the host window.

For DEMO purposes, we have currently have three different IFrame clients based on:
    
1. [Angular 1.2](https://www.angularjs.org/)
2. [Angular 1.3](https://www.angularjs.org/)
3. [JQuery 2.1.1](http://www.jquery.com/)

##How to Use##
1. The host application is located in the root folder **index.html**
2. Add client IFrames by clicking the "+"
3. Messages can be sent to different clients via the recipient list

##To-Do's##
There are plenty :-(

**Top item: write unit tests - may be convert the 'api' and 'core' libraries to use AMD module definitions (Common/RequiredJS) for easier unit-testing**

##Library Structure##
    
	 [IFHC]
	 * Root folder of IFHC andlibrary
	 |    
	 |-- [dist]
	 |    * Distribution Folder
	 |    |
	 |    |-- IFHC.min.js
	 |        * Compiled and minified IFHC library file
	 |    
	 |-- [src]
	 * Source Folder
	 |
	 |-- [core]
	 |    * The basic objects/libraries that the 'api' is dependent on
	 |    |
	 |    |-- [attachment-library]
	 |    |    * Contains all components related to this library
	 |    |    |    
	 |    |    |-- (attachment-constant.js)
	 |    |    |    * Data package type defintions
	 |    |    |    
	 |    |    |-- (attachment-library.js)
	 |    |        * Data package factory - creates different package types
	 |    |
	 |    |-- [client-library]
	 |    |    * Contains all components related to this library
	 |    |    |
	 |    |    |-- (client-library.js)
	 |    |        * Base 'Client' functionality library
	 |    |        * Functionality to 'postMessage' to browser window
	 |    |
	 |    |-- [hash-library]
	 |    |    * Contains all components related to this library
	 |    |    |
	 |    |    |-- (hash-library.js)
	 |    |        * HASH bucket library
	 |    |
	 |    |-- [server-library]
	 |    |    * Contains all components related to this library
	 |    |    |
	 |    |    |-- (server-constant.js)
	 |    |    |    * Server constant definitions
	 |    |    |
	 |    |    |-- (server-library.js)
	 |    |        * Base 'Server' functionality library
	 |    |        * Keeps track of all connected clients
	 |    |        * Functionality to 'postMessage' to any IFrame client
	 |    |
	 |    |-- [transmission-library]
	 |    |    * Contains all components related to this library
	 |    |    |
	 |    |    |-- (transmission-library.js)
	 |    |        * Base 'Transmission' object library
	 |    |        * Creates the 'Transmission' object
	 |    |
	 |    |-- [utility-library]
	 |        * Contains all components related to this library
	 |        |
	 |        |-- (utility-library.js)
	 |        * Miscellaneous helper functions
	 |
	 |-- [api]
	 |    * API Libraries
	 |    |
	 |    |-- (api-attachment-library.js)
	 |    |    * A 'Transmission' encapsulates a data package, 'Attachment;' 
	 |    |    this is a processing library for this data
	 |    |    * Extension of ./core/attachment-library
	 |    |
	 |    |-- (api-client-library.js)
	 |    |    * The 'IFHC Client' library (requires a deferred library 
	 |    |      Angular/JQuery wrapper)
	 |    |    * Extension of ./core/client-library
	 |    |    * 'IFHC Clients' communicates with the 'IFHC Host' and other 
	 |    |      'IFHC Clients' through 'Transmissions.'
	 |    |    * 'IFHC Client-to-Client' communication is couriered via 'IFHC 
	 |    |      Host'
	 |    |
	 |    |-- (api-host-library.js)
	 |    |    * The 'IFHC Host' library (allows for an optional router 
	 |    |      extension)
	 |    |    * Extension of ./core/server-library
	 |    |     * The host is single point of contact for all 'Transmissions' 
	 |    |      sent by client(s)
	 |    |    
	 |    |-- (api-route-constant.js)
	 |    |    * URI/Route definitions
	 |    |
	 |    |-- (api-router-library.js)
	 |        * This is a processing library that handles all 'Tranmissions' 
	 |          sent to the 'IFHC Host'
	 |         
	 |-- (api-template-footer.js)
	 |    * Generated 'IFHC' library footer template
	 |
	 |-- (api-template-header.js)
	     * Generated 'IFHC' library header template