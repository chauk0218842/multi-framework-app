#IFrame Host/Client 1.0.1#

##Introduction##
This is a research app to allow different Single Page Applications (SPA) be able to reside in harmony on a single browser window.

###Implementation###
The purposed implementation is to create a mock "host/client" network.  

Each client SPA will be loaded into the host browser window as an IFrame - a special JS library is used to to bridge the communication of the SPA client(s) and the host window.

For DEMO purposes, we have currently have three different IFrame clients based on:
	
1. [Angular 1.3](https://www.angularjs.org/)
2. [Angular 1.2](https://www.angularjs.org/)
3. [JQuery 2.1.1](http://www.jquery.com/)

##How to Use##
1. The host application is located in the folder **server/index.html**
2. Add client IFrames by clicking the "+"
3. Messages can be sent to different clients via the recipient list
