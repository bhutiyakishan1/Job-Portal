#messages
Standard messages for REST APIs.


##Why?
General error messages such as "REQUIRED" make for great keys in a map.  It's very easy to use such keys on the client to render appropriate text from i18n resources.

###Example
In this example the server responds back with this:

````json
{
  "error":"NOT_FOUND"
}
````

The client handles the response as follows:
````javascript
var i18n = {
  "en":{
    "NOT_FOUND":"The resource wasn't found"
  }
};

$.json('/some/resource', function(data){
   if(!data || data.error){
      console.log(i18n.en[data.error]);
   }
});
````

##Extending
You can easily publish extensions by adding or removing properties on a `require`d instance of `messages`.

###Example
````javascript
var messages   = require('messages');
module.exports = messages;
messages.FOO   = "FOO";
````

##Contributing
Issue a pull request.  Keep in mind though, that the message should be general to most REST APIs to be included here.

## LICENSE
``````
Copyright 2013 Joseph Spencer

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
``````

