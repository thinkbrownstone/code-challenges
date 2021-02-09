
## Migdalia Brito's Notes
Hi! First of, thank you for giving me the opportunity to participate in this code challenge. It was fun! I made the following assumptions when building this prototype:

 - This content is going to be served on a server of some sort. This will prevent Chrome from blocking the local JSON file request. (Relevant error: `Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https` ).
 - I assumed some preprocessor will be used/provided to the client to compile files such as SCSS and JS. Attached to this pull request is a simple Gulp file I used to compile my JS/CSS.
 - I assumed that having the forms have default content is ok for the prototype.
 - I assumed that the prototype does not account for future/additional traveling time options and purchasing methods. They were manually added to the HTML.
 - I assumed prices may change over time and coded in a way that supported those changes in the data.

### Additional Notes
 - I have marked a TODO in the JS file that notes an IE8 issue with Ajax loading in the JSON file.
 - The anytime ticket discount is only shown when the user has selected the Station Kiosk purchasing option and the the discounted rate is cheaper than the standard rate.

Any feedback would be appreciated!
