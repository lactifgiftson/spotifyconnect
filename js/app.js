webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {
	
	function getCookie(name){
	    var pattern = RegExp(name + "=.[^;]*");
	    matched = document.cookie.match(pattern);
	    if(matched){
	        var cookie = matched[0].split('=');
	        return cookie[1];
	    }
	    return null;
	};

	'use strict';
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var WmgSpotifyWrapper = __webpack_require__(2);
	
	var spotifyOptions = {
	  clientId: 'a9a96517a88f4386ad1b971b326d137c',
	  scopes: ['playlist-read-private', 'playlist-modify-public', 'playlist-modify-private', 'user-follow-modify', 'user-read-email'],
	  startButton: 'follow-artist',
	  container: 'spotify-app',
	  requiredTracks: ['spotify:track:0y8Wf6ltWpGCpgqVa21QNX'],
	  afterLogin: function afterLogin() {
	    console.log("After login");
	    jQuery(".overlay,.mlist-section").fadeIn();
		   this.spotifyApi.followArtists(['5YENCIQVzziCFdoVWc26Bn']).then(function () {
		       console.log('followed artist');
		       registerForEmail(userEmailid,"test");
	      	});
	        jQuery('.mlist-section').fadeIn(500);
	        var getspotifyApi = this.spotifyApi;
	    var addTrackBtn = document.getElementById('spotify-connect');
	    addTrackBtn.addEventListener('click', (function (e) {
	    }).bind(this));
	    
	  }
	};
	
	var init = function init() {
	  console.log("In init");
	  wmgSpotify = new WmgSpotifyWrapper(spotifyOptions);
	};
	
	var bindEvents = function bindEvents() {};
			
	document.addEventListener("DOMContentLoaded", function (event) {
	  console.log("ready");
	  init();
	});
	
	Element.prototype.remove = function () {
	  this.parentElement.removeChild(this);
	};
	
	NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
	  for (var i = this.length - 1; i >= 0; i--) {
	    if (this[i] && this[i].parentElement) {
	      this[i].parentElement.removeChild(this[i]);
	    }
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	(function () {
	  'use strict';
	
	  var SpotifyWebApi = __webpack_require__(3);
	  var Q = __webpack_require__(4);
	  //const Awesomplete = require('awesomplete')
	  //const styleSelect = require('styleselect')
	
	  var WmgSpotifyWrapper = function WmgSpotifyWrapper(options) {
	    console.log(options);
	    this.options = options || {};
	    this.spotifyApi = new SpotifyWebApi();
	    this.startButton = document.getElementById(this.options.startButton) || null;
	    this.container = document.getElementById(this.options.container) || null;
	    this.clientId = this.options.clientId || null;
	    console.log("uri"+this.redirectUri);
	    this.redirectUri = this.options.redirectUri || window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + 'spotify_callback.html?';
	    this.scopes = this.options.scopes || null;
	    this.user = {};
	    this.afterLogin = this.options.afterLogin;
	    this.artist = this.options.artist || null;
	    this.requiredTracks = this.options.requiredTracks || [];
	
	    this.messageEl = document.createElement('p');
	    this.messageEl.classList.add('message');
	
	    this.errors = [];
	    this.errorEl = document.createElement('p');
	    this.errorEl.classList.add('error');
	    this.errorEl.setAttribute('hidden', true);
	
	    this.innerEl = document.createElement('div');
	    this.innerEl.classList.add('inner');
	
	    if (this.container) {
	      this.container.setAttribute('hidden', true);
	      this.container.appendChild(this.messageEl);
	      this.container.appendChild(this.errorEl);
	      this.container.appendChild(this.innerEl);
	      this.init();
	    } else {
	      console.log('WmgSpotifyWrapper: No container specified');
	    }
	  };
	
	  WmgSpotifyWrapper.prototype.init = function () {
	    this.bindEvents();
	  };
	
	  WmgSpotifyWrapper.prototype.bindEvents = function () {
	    this.startButton.addEventListener('click', (function () {
	      this.login((function (accessToken) {
	        this.loginCallback(accessToken);
	      }).bind(this));
	    }).bind(this), false);
	  };
	
	  WmgSpotifyWrapper.prototype.login = function (callback) {
	    if (this.clientId && this.redirectUri && this.scopes) {
	      var clientId = this.clientId;
	      var redirectUri = this.redirectUri;
	
	      var getLoginURL = (function (scopes) {
	        return 'https://accounts.spotify.com/authorize?client_id=' + this.clientId + '&redirect_uri=' + encodeURIComponent(this.redirectUri) + '&scope=' + encodeURIComponent(scopes.join(' ')) + '&response_type=code';
	      }).bind(this);
	
	      var url = getLoginURL(this.scopes);
	
	      window.addEventListener("message", function (event) {
	      	var s = event.data.replace(/[\u0000_\u0019]+/g,""); 
	        var hash = JSON.parse(event.data);
	        if (hash.type == 'access_token') {
	          callback(hash.access_token);
	        }
	      }, false);
	
	      var width = 450,
	          height = 730,
	          left = screen.width / 2 - width / 2,
	          top = screen.height / 2 - height / 2;
	
	      var w = window.open(url, 'Spotify', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no, ' + 'width=' + width + ', ' + 'height=' + height + ', ' + 'top=' + top + ', ' + 'left=' + left);
	    } else {
	      return false;
	    }
	  };
	
	  WmgSpotifyWrapper.prototype.loginCallback = function (accessToken) {
	    this.spotifyApi.setAccessToken(accessToken);
	    this.spotifyApi.setPromiseImplementation(Q);
	    this.spotifyApi.getMe().then((function (user) {
	    	console.log(user);
	      userEmailid = user.email;	
	      this.user = user;
	      this.user.playlists = [];
	      this.container.removeAttribute('hidden');
	      this.afterLogin();
	    }).bind(this));
	  };
	
	  WmgSpotifyWrapper.prototype.getUserPlaylists = function () {
	
	    var promises = [];
	
	    var get = (function (cb) {
	      var options = {
	        limit: 50,
	        offset: this.user.playlists.length
	      };
	      var promise = this.spotifyApi.getUserPlaylists(this.user.id, options) // Get current users playlists
	      .then((function (userPlaylists) {
	       console.log("In get user playlist function"+userPlaylists.items);
	       console.log(userPlaylists);
		       for(var i=0; i<userPlaylists.items.length; i++){
			       	if(userPlaylists.items[i].owner.id === this.user.id){
			       		console.log(userPlaylists.items[i].owner.id);
			       		this.user.playlists = this.user.playlists.concat(userPlaylists.items[i]);
			       	}
		       }
	        if (userPlaylists.next) {
	          get(cb);
	        } else {
	          cb();
	        }
	        return this.user.playlists;
	      }).bind(this), function (err) {
	        console.log(err);
	      });
	      promises.push(promise);
	      return promise;
	    }).bind(this);
	
	    return get(function () {
	      //console.log(promises)
	      return Q.allSettled(promises);
	    });
	  };
	
	  WmgSpotifyWrapper.prototype.getTrackCountInPlaylists = function (trackIds) {
	
	    for (var i = 0; i < trackIds.length; i++) {
	      if (trackIds[i].indexOf("spotify:track") >= 0) {
	        trackIds[i] = trackIds[i].replace("spotify:track:", "");
	      }
	    }
	
	    var promises = [];
	
	    return this.getUserPlaylists().then((function (playlists) {
		console.log("in getUserplaylist:"+playlists);
	      _.each(playlists, (function (playlist) {
	        // Loop through playlists
	        if (playlist.owner.id === this.user.id) {
	          var promise = this.spotifyApi.getPlaylistTracks(this.user.id, playlist.id); // Get tracks from playlist
	          promises.push(promise); // Collect array of promises
	        }
	      }).bind(this));
	
	      return Q.allSettled(promises).then(function (promises) {
	        // Fire when all promises have finished processing
	        var tracks = _.flatten(_(_.chain(promises).filter({ 'state': 'fulfilled' }).map(function (p) {
	          return _.map(p.value.items, function (t) {
	            return t.track;
	          });
	        })).valueOf()); // Turn big array of promises into one array of all playlist tracks
	
	        var artistPlaylistedTracks = [];
	
	        for (var i = 0; i < tracks.length; i++) {
	          for (var j = 0; j < trackIds.length; j++) {
	            if (trackIds[j] == tracks[i].id) {
	              artistPlaylistedTracks.push(tracks[i]);
	            }
	          }
	        }
	
	        return artistPlaylistedTracks;
	      });
	    }).bind(this));
	  };
	
	  WmgSpotifyWrapper.prototype.chooseUserPlaylist = function (container, playlists, format, cb) {
	    //if (!container || !playlists || !format) { return false; }
	
	    var output = document.createDocumentFragment();
	    var container = document.querySelector(container) || null;
		
		if(playlists.length==0){
			document.getElementById('modal').innerHTML="";
			var noPlaylistMessage = document.createElement('div');
			noPlaylistMessage.id="no-playlist-message";
			noPlaylistMessage.innerHTML="You have no playlist of your own";
			document.getElementById('modal').appendChild(noPlaylistMessage);
			var closeDiv = document.createElement('a');
			document.getElementById('modal').insertBefore(closeDiv, noPlaylistMessage);
			closeDiv.id="close";
			closeDiv.innerHTML="X";
			document.cookie = "TrackAddition=Success";
			document.getElementById("spotify-connect").disabled = true; 
			document.getElementById("spotify-connect").className += " disabled";
			document.getElementById('close').addEventListener("click", function(){
				document.getElementById('modal').style.display="none";
				document.getElementById('add-track-error').style.display = "none";
			});
		}
		
	    if (format == 'select') {
	      var selectEl = document.createElement('select');
	      selectEl.id = 'playlist-select';
	      var startingOption = document.createElement('option');
	      startingOption.label = startingOption.innerHTML = 'Choose your playlist';
	      startingOption.value = 'false';
	
	      selectEl.appendChild(startingOption);
	
	      for (var i = 0; i < playlists.length; i++) {
	        var playlist = this.user.playlists[i];
	        var optionEl = document.createElement('option');
	        optionEl.label = optionEl.innerHTML = playlist.name;
	        optionEl.value = playlist.id;
	        selectEl.appendChild(optionEl);
	      }
	
	      output.appendChild(selectEl);
	    } else if (format == 'checkbox') {
	      var playlistsEl = document.createElement('div');
	      playlistsEl.id = 'playlist-select';
	
	      for (var i = 0; i < playlists.length; i++) {
	        var wrapper = document.createElement('div');
	        wrapper.classList.add('playlist');
	
	        var inputEl = document.createElement('input');
	        inputEl.type = 'checkbox';
	        inputEl.name = inputEl.id = playlists[i].id;
	
	        var labelEl = document.createElement('label');
	        labelEl.htmlFor = playlists[i].id;
	
	        var spanEl = document.createElement('span');
	        spanEl.classList.add('ui');
	        spanEl.innerHTML = playlists[i].name;
	
	        wrapper.appendChild(inputEl);
	        labelEl.appendChild(spanEl);
	        wrapper.appendChild(labelEl);
	
	        playlistsEl.appendChild(wrapper);
	      }
	
	      output.appendChild(playlistsEl);
	    } else {
	      return false;
	    }
	    container.appendChild(output);
	  };
	
	  WmgSpotifyWrapper.prototype.addTracksToUserPlaylist = function (message, cb) {
	    var output = document.createDocumentFragment();
	    var wrapperEl = document.createElement('div');
	    wrapperEl.id = 'add-tracks-user-playlist';
	    var selectEl = document.createElement('select');
	    selectEl.id = 'playlist-select';
	
	    this.setMessage(message);
	    this.errorEl.setAttribute('hidden', true);
	
	    var startingOption = document.createElement('option');
	    startingOption.label = startingOption.innerHTML = 'Choose your playlist';
	    startingOption.value = 'false';
	
	    selectEl.appendChild(startingOption);
	
	    for (var i = 0; i < this.user.playlists.length; i++) {
	      var playlist = this.user.playlists[i];
	      var optionEl = document.createElement('option');
	      optionEl.label = optionEl.innerHTML = playlist.name;
	      optionEl.value = playlist.id;
	      selectEl.appendChild(optionEl);
	    }
	
	    wrapperEl.appendChild(selectEl);
	
	    var instructionsEl = document.createElement('p');
	    instructionsEl.innerHTML = 'Click the track to add to your playlist';
	
	    wrapperEl.appendChild(instructionsEl);
	
	    var tracksContainer = document.createElement('div');
	    tracksContainer.id = 'required-tracks';
	
	    this.spotifyApi.getTracks(this.requiredTracks).then((function (data) {
	
	      var tracks = data.tracks;
	      for (var i = 0; i < tracks.length; i++) {
	        var track = tracks[i];
	        var trackContainer = document.createElement('div');
	        trackContainer.classList.add('track');
	
	        var trackInputEl = document.createElement('input');
	        trackInputEl.type = 'checkbox';
	        trackInputEl.id = 'track-' + (i + 1);
	        trackInputEl.dataset.trackUri = track.uri;
	        trackInputEl.dataset.trackName = track.name;
	
	        trackContainer.appendChild(trackInputEl);
	
	        var trackLabelEl = document.createElement('label');
	        trackLabelEl.htmlFor = 'track-' + (i + 1);
	        trackLabelEl.innerHTML = '<span class="ui"><img src="' + track.album.images[1].url + '"></span>';
	
	        trackContainer.appendChild(trackLabelEl);
	
	        tracksContainer.appendChild(trackContainer);
	      }
	
	      wrapperEl.appendChild(tracksContainer);
	      output.appendChild(wrapperEl);
	
	      var continueButton = document.createElement('button');
	      continueButton.type = 'button';
	      continueButton.classList.add('continue-btn');
	      continueButton.innerHTML = '<i class="fa fa-chevron-right"></i><span>Next Step</span>';
	
	      continueButton.addEventListener('click', (function (e) {
	        var selectedPlaylistId = selectEl.options[selectEl.selectedIndex].value;
	        var trackInputs = tracksContainer.querySelectorAll('.track input');
	        var selectedTracks = [];
	        _callOmnitureClick('Page 2', 'Next Step Click');
	        for (var i = 0; i < trackInputs.length; i++) {
	          if (trackInputs[i].checked) {
	            selectedTracks.push(trackInputs[i].dataset.trackUri);
	            _callOmnitureClick('Page 2', trackInputs[i].dataset.trackName + ' Add Track Click');
	          }
	        }
	        if (selectedPlaylistId === "false" || selectedTracks.length == 0) {
	          this.setError('Please select a playlist and some tracks to continue');
	          alert("Please select a playlist!");
	        } else {
	          this.spotifyApi.addTracksToPlaylist(this.user.id, selectedPlaylistId, selectedTracks).then(function (res) {
	            cb();
	          });
	        }
	      }).bind(this), false);
	
	      output.appendChild(continueButton);
	
	      this.innerEl.appendChild(output);
	
	      styleSelect('select#playlist-select');
	    }).bind(this), function (err) {
	      console.log(err);
	    });
	  };
	
	  WmgSpotifyWrapper.prototype.searchTracks = function (message, cb) {
	    var autocomplete;
	    var output = document.createDocumentFragment();
	
	    this.setMessage(message);
	    this.errorEl.setAttribute('hidden', true);
	
	    var searchInput = document.createElement('input');
	    searchInput.type = 'text';
	    searchInput.id = 'search-input';
	    searchInput.placeholder = 'Example: Summer Lovin';
	
	    searchInput.addEventListener('keyup', (function (e) {
	
	      setTimeout((function () {
	        this.spotifyApi.searchTracks(searchInput.value).then((function (data) {
	          var results = _.map(data.tracks.items, function (track) {
	            return { label: track.name + ' - ' + track.artists[0].name, value: JSON.stringify({ artist: track.artists[0].name, name: track.name, id: track.id }) };
	          });
	          autocomplete.list = results;
	        }).bind(this));
	      }).bind(this), 1000);
	    }).bind(this), false);
	
	    output.appendChild(searchInput);
	
	    this.innerEl.innerHTML = '';
	    this.innerEl.appendChild(output);
	
	    autocomplete = new Awesomplete(searchInput, {
	      minChars: 2
	    });
	
	    window.addEventListener('awesomplete-selectcomplete', function (e) {
	      cb(e.text);
	      e.target.value = '';
	    }, false);
	  };
	
	  WmgSpotifyWrapper.prototype.setMessage = function (message) {
	    this.messageEl.innerHTML = '';
	    this.messageEl.innerHTML = message;
	    return true;
	  };
	
	  WmgSpotifyWrapper.prototype.setError = function (error) {
	    this.errorEl.innerHTML = '';
	    this.errorEl.removeAttribute('hidden');
	    this.errorEl.innerHTML = error;
	    return true;
	  };
	
	  if (typeof module === 'object' && typeof module.exports === 'object') {
	    module.exports = WmgSpotifyWrapper;
	  }
	})(window);

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* global module */
	'use strict';
	var SpotifyWebApi = (function() {
	
	  var _baseUri = 'https://api.spotify.com/v1';
	  var _accessToken = null;
	  var _promiseImplementation = null;
	
	  var WrapPromiseWithAbort = function(promise, onAbort) {
	    promise.abort = onAbort;
	    return promise;
	  };
	
	  var _promiseProvider = function(promiseFunction, onAbort) {
	    var returnedPromise;
	    if (_promiseImplementation !== null) {
	      var deferred = _promiseImplementation.defer();
	      promiseFunction(function(resolvedResult) {
	        deferred.resolve(resolvedResult);
	      }, function(rejectedResult) {
	        deferred.reject(rejectedResult);
	      });
	      returnedPromise = deferred.promise;
	    } else {
	      if (window.Promise) {
	        returnedPromise = new window.Promise(promiseFunction);
	      }
	    }
	
	    if (returnedPromise) {
	      return new WrapPromiseWithAbort(returnedPromise, onAbort);
	    } else {
	      return null;
	    }
	  };
	
	  var _extend = function() {
	    var args = Array.prototype.slice.call(arguments);
	    var target = args[0];
	    var objects = args.slice(1);
	    target = target || {};
	    objects.forEach(function(object) {
	      for (var j in object) {
	        if (object.hasOwnProperty(j)) {
	          target[j] = object[j];
	        }
	      }
	    });
	    return target;
	  };
	
	  var _buildUrl = function(url, parameters) {
	    var qs = '';
	    for (var key in parameters) {
	      if (parameters.hasOwnProperty(key)) {
	        var value = parameters[key];
	        qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
	      }
	    }
	    if (qs.length > 0) {
	      // chop off last '&'
	      qs = qs.substring(0, qs.length - 1);
	      url = url + '?' + qs;
	    }
	    return url;
	  };
	
	  var _performRequest = function(requestData, callback) {
	
	    var req = new XMLHttpRequest();
	
	    var promiseFunction = function(resolve, reject) {
	
	      function success(data) {
	        if (resolve) {
	          resolve(data);
	        }
	        if (callback) {
	          callback(null, data);
	        }
	      }
	
	      function failure() {
	        if (reject) {
	          reject(req);
	        }
	        if (callback) {
	          callback(req, null);
	        }
	      }
	
	      var type = requestData.type || 'GET';
	      req.open(type, _buildUrl(requestData.url, requestData.params));
	      if (_accessToken) {
	        req.setRequestHeader('Authorization', 'Bearer ' + _accessToken);
	      }
	
	      req.onreadystatechange = function() {
	        if (req.readyState === 4) {
	          var data = null;
	          try {
	            data = req.responseText ? JSON.parse(req.responseText) : '';
	          } catch (e) {
	            console.error(e);
	          }
	
	          if (req.status >= 200 && req.status < 300) {
	            success(data);
	          } else {
	            failure();
	          }
	        }
	      };
	
	      if (type === 'GET') {
	        req.send(null);
	      } else {
	        req.send(requestData.postData ? JSON.stringify(requestData.postData) : null);
	      }
	    };
	
	    if (callback) {
	      promiseFunction();
	      return null;
	    } else {
	      return _promiseProvider(promiseFunction, function() {
	        req.abort();
	      });
	    }
	  };
	
	  var _checkParamsAndPerformRequest = function(requestData, options, callback) {
	    var opt = {};
	    var cb = null;
	
	    if (typeof options === 'object') {
	      opt = options;
	      cb = callback;
	    } else if (typeof options === 'function') {
	      cb = options;
	    }
	
	    // options extend postData, if any. Otherwise they extend parameters sent in the url
	    var type = requestData.type || 'GET';
	    if (type !== 'GET' && requestData.postData) {
	      requestData.postData = _extend(requestData.postData, opt);
	    } else {
	      requestData.params = _extend(requestData.params, opt);
	    }
	    return _performRequest(requestData, cb);
	  };
	
	  var Constr = function() {};
	
	  Constr.prototype = {
	    constructor: SpotifyWebApi
	  };
	
	  /**
	   * Fetches a resource through a generic GET request.
	   * @param {string} url The URL to be fetched
	   * @param {function(Object,Object)} callback An optional callback
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getGeneric = function(url, callback) {
	    var requestData = {
	      url: url
	    };
	    return _checkParamsAndPerformRequest(requestData, callback);
	  };
	
	  /**
	   * Fetches information about the current user.
	   * See [Get Current User's Profile](https://developer.spotify.com/web-api/get-current-users-profile/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getMe = function(options, callback) {
	    var requestData = {
	      url: _baseUri + '/me'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches current user's saved tracks.
	   * See [Get Current User's Saved Tracks](https://developer.spotify.com/web-api/get-users-saved-tracks/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getMySavedTracks = function(options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/tracks'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Adds a list of tracks to the current user's saved tracks.
	   * See [Save Tracks for Current User](https://developer.spotify.com/web-api/save-tracks-user/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
	   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.addToMySavedTracks = function(trackIds, options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/tracks',
	      type: 'PUT',
	      postData: trackIds
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Remove a list of tracks from the current user's saved tracks.
	   * See [Remove Tracks for Current User](https://developer.spotify.com/web-api/remove-tracks-user/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
	   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.removeFromMySavedTracks = function(trackIds, options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/tracks',
	      type: 'DELETE',
	      postData: trackIds
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Checks if the current user's saved tracks contains a certain list of tracks.
	   * See [Check Current User's Saved Tracks](https://developer.spotify.com/web-api/check-users-saved-tracks/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
	   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.containsMySavedTracks = function(trackIds, options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/tracks/contains',
	      params: { ids: trackIds.join(',') }
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Get a list of the albums saved in the current Spotify user's "Your Music" library.
	   * See [Get Current User's Saved Albums](https://developer.spotify.com/web-api/get-users-saved-albums/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getMySavedAlbums = function(options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/albums'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Save one or more albums to the current user's "Your Music" library.
	   * See [Save Albums for Current User](https://developer.spotify.com/web-api/save-albums-user/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
	   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.addToMySavedAlbums = function(albumIds, options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/albums',
	      type: 'PUT',
	      postData: albumIds
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Remove one or more albums from the current user's "Your Music" library.
	   * See [Remove Albums for Current User](https://developer.spotify.com/web-api/remove-albums-user/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
	   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.removeFromMySavedAlbums = function(albumIds, options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/albums',
	      type: 'DELETE',
	      postData: albumIds
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Check if one or more albums is already saved in the current Spotify user's "Your Music" library.
	   * See [Check User's Saved Albums](https://developer.spotify.com/web-api/check-users-saved-albums/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
	   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.containsMySavedAlbums = function(albumIds, options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/albums/contains',
	      params: { ids: albumIds.join(',') }
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Get the current user’s top artists based on calculated affinity.
	   * See [Get a User’s Top Artists](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getMyTopArtists = function(options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/top/artists'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Get the current user’s top tracks based on calculated affinity.
	   * See [Get a User’s Top Tracks](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getMyTopTracks = function(options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/top/tracks'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Adds the current user as a follower of one or more other Spotify users.
	   * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
	   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.followUsers = function(userIds, callback) {
	    var requestData = {
	      url: _baseUri + '/me/following/',
	      type: 'PUT',
	      params: {
	        ids: userIds.join(','),
	        type: 'user'
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, callback);
	  };
	
	  /**
	   * Adds the current user as a follower of one or more artists.
	   * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
	   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.followArtists = function(artistIds, callback) {
	    var requestData = {
	      url: _baseUri + '/me/following/',
	      type: 'PUT',
	      params: {
	        ids: artistIds.join(','),
	        type: 'artist'
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, callback);
	  };
	
	  /**
	   * Add the current user as a follower of one playlist.
	   * See [Follow a Playlist](https://developer.spotify.com/web-api/follow-playlist/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} ownerId The id of the playlist owner. If you know the Spotify URI of
	   * the playlist, it is easy to find the owner's user id
	   * (e.g. spotify:user:<here_is_the_owner_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {Object} options A JSON object with options that can be passed. For instance,
	   * whether you want the playlist to be followed privately ({public: false})
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.followPlaylist = function(ownerId, playlistId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/users/' + ownerId + '/playlists/' + playlistId + '/followers',
	      type: 'PUT',
	      postData: {}
	    };
	
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Removes the current user as a follower of one or more other Spotify users.
	   * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
	   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.unfollowUsers = function(userIds, callback) {
	    var requestData = {
	      url: _baseUri + '/me/following/',
	      type: 'DELETE',
	      params: {
	        ids: userIds.join(','),
	        type: 'user'
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, callback);
	  };
	
	  /**
	   * Removes the current user as a follower of one or more artists.
	   * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
	   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.unfollowArtists = function(artistIds, callback) {
	    var requestData = {
	      url: _baseUri + '/me/following/',
	      type: 'DELETE',
	      params: {
	        ids: artistIds.join(','),
	        type: 'artist'
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, callback);
	  };
	
	  /**
	   * Remove the current user as a follower of one playlist.
	   * See [Unfollow a Playlist](https://developer.spotify.com/web-api/unfollow-playlist/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} ownerId The id of the playlist owner. If you know the Spotify URI of
	   * the playlist, it is easy to find the owner's user id
	   * (e.g. spotify:user:<here_is_the_owner_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.unfollowPlaylist = function(ownerId, playlistId, callback) {
	    var requestData = {
	      url: _baseUri + '/users/' + ownerId + '/playlists/' + playlistId + '/followers',
	      type: 'DELETE'
	    };
	    return _checkParamsAndPerformRequest(requestData, callback);
	  };
	
	  /**
	   * Checks to see if the current user is following one or more other Spotify users.
	   * See [Check if Current User Follows Users or Artists](https://developer.spotify.com/web-api/check-current-user-follows/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
	   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is an array of boolean values that indicate
	   * whether the user is following the users sent in the request.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.isFollowingUsers = function(userIds, callback) {
	    var requestData = {
	      url: _baseUri + '/me/following/contains',
	      type: 'GET',
	      params: {
	        ids: userIds.join(','),
	        type: 'user'
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, callback);
	  };
	
	  /**
	   * Checks to see if the current user is following one or more artists.
	   * See [Check if Current User Follows](https://developer.spotify.com/web-api/check-current-user-follows/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
	   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is an array of boolean values that indicate
	   * whether the user is following the artists sent in the request.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.isFollowingArtists = function(artistIds, callback) {
	    var requestData = {
	      url: _baseUri + '/me/following/contains',
	      type: 'GET',
	      params: {
	        ids: artistIds.join(','),
	        type: 'artist'
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, callback);
	  };
	
	  /**
	   * Check to see if one or more Spotify users are following a specified playlist.
	   * See [Check if Users Follow a Playlist](https://developer.spotify.com/web-api/check-user-following-playlist/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} ownerId The id of the playlist owner. If you know the Spotify URI of
	   * the playlist, it is easy to find the owner's user id
	   * (e.g. spotify:user:<here_is_the_owner_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
	   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is an array of boolean values that indicate
	   * whether the users are following the playlist sent in the request.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.areFollowingPlaylist = function(ownerId, playlistId, userIds, callback) {
	    var requestData = {
	      url: _baseUri + '/users/' + ownerId + '/playlists/' + playlistId + '/followers/contains',
	      type: 'GET',
	      params: {
	        ids: userIds.join(',')
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, callback);
	  };
	
	  /**
	   * Get the current user's followed artists.
	   * See [Get User's Followed Artists](https://developer.spotify.com/web-api/get-followed-artists/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Object} [options] Options, being after and limit.
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is an object with a paged object containing
	   * artists.
	   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a paging object which contains
	   * artists objects. Not returned if a callback is given.
	   */
	  Constr.prototype.getFollowedArtists = function(options, callback) {
	    var requestData = {
	      url: _baseUri + '/me/following',
	      type: 'GET',
	      params: {
	        type: 'artist'
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches information about a specific user.
	   * See [Get a User's Profile](https://developer.spotify.com/web-api/get-users-profile/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
	   * to find the id (e.g. spotify:user:<here_is_the_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getUser = function(userId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/users/' + userId
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches a list of the current user's playlists.
	   * See [Get a List of a User's Playlists](https://developer.spotify.com/web-api/get-list-users-playlists/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId An optional id of the user. If you know the Spotify URI it is easy
	   * to find the id (e.g. spotify:user:<here_is_the_id>). If not provided, the id of the user that granted
	   * the permissions will be used.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getUserPlaylists = function(userId, options, callback) {
	    var requestData;
	    if (typeof userId === 'string') {
	      requestData = {
	        url: _baseUri + '/users/' + userId + '/playlists'
	      };
	    } else {
	      requestData = {
	        url: _baseUri + '/me/playlists'
	      };
	      callback = options;
	      options = userId;
	    }
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches a specific playlist.
	   * See [Get a Playlist](https://developer.spotify.com/web-api/get-playlist/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
	   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getPlaylist = function(userId, playlistId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches the tracks from a specific playlist.
	   * See [Get a Playlist's Tracks](https://developer.spotify.com/web-api/get-playlists-tracks/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
	   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getPlaylistTracks = function(userId, playlistId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Creates a playlist and stores it in the current user's library.
	   * See [Create a Playlist](https://developer.spotify.com/web-api/create-playlist/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. You may want to user the "getMe" function to
	   * find out the id of the current logged in user
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.createPlaylist = function(userId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/users/' + userId + '/playlists',
	      type: 'POST',
	      postData: options
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Change a playlist's name and public/private state
	   * See [Change a Playlist's Details](https://developer.spotify.com/web-api/change-playlist-details/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. You may want to user the "getMe" function to
	   * find out the id of the current logged in user
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {Object} data A JSON object with the data to update. E.g. {name: 'A new name', public: true}
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.changePlaylistDetails = function(userId, playlistId, data, callback) {
	    var requestData = {
	      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId,
	      type: 'PUT',
	      postData: data
	    };
	    return _checkParamsAndPerformRequest(requestData, data, callback);
	  };
	
	  /**
	   * Add tracks to a playlist.
	   * See [Add Tracks to a Playlist](https://developer.spotify.com/web-api/add-tracks-to-playlist/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
	   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {Array<string>} uris An array of Spotify URIs for the tracks
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.addTracksToPlaylist = function(userId, playlistId, uris, options, callback) {
	    var requestData = {
	      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks',
	      type: 'POST',
	      params: {
	        uris: uris
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Replace the tracks of a playlist
	   * See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
	   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {Array<string>} uris An array of Spotify URIs for the tracks
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.replaceTracksInPlaylist = function(userId, playlistId, uris, callback) {
	    var requestData = {
	      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks',
	      type: 'PUT',
	      postData: {uris: uris}
	    };
	    return _checkParamsAndPerformRequest(requestData, {}, callback);
	  };
	
	  /**
	   * Reorder tracks in a playlist
	   * See [Reorder a Playlist’s Tracks](https://developer.spotify.com/web-api/reorder-playlists-tracks/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
	   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {number} rangeStart The position of the first track to be reordered.
	   * @param {number} insertBefore The position where the tracks should be inserted. To reorder the tracks to
	   * the end of the playlist, simply set insert_before to the position after the last track.
	   * @param {Object} options An object with optional parameters (range_length, snapshot_id)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.reorderTracksInPlaylist = function(userId, playlistId, rangeStart, insertBefore, options, callback) {
	    /*jshint camelcase: false */
	    var requestData = {
	      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks',
	      type: 'PUT',
	      postData: {
	        range_start: rangeStart,
	        insert_before: insertBefore
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Remove tracks from a playlist
	   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
	   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
	   * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
	   * string) and `positions` (which is an array of integers).
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.removeTracksFromPlaylist = function(userId, playlistId, uris, callback) {
	    var dataToBeSent = uris.map(function(uri) {
	      if (typeof uri === 'string') {
	        return { uri: uri };
	      } else {
	        return uri;
	      }
	    });
	
	    var requestData = {
	      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks',
	      type: 'DELETE',
	      postData: {tracks: dataToBeSent}
	    };
	    return _checkParamsAndPerformRequest(requestData, {}, callback);
	  };
	
	  /**
	   * Remove tracks from a playlist, specifying a snapshot id.
	   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
	   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
	   * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
	   * string) and `positions` (which is an array of integers).
	   * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.removeTracksFromPlaylistWithSnapshotId = function(userId, playlistId, uris, snapshotId, callback) {
	    /*jshint camelcase: false */
	    var dataToBeSent = uris.map(function(uri) {
	      if (typeof uri === 'string') {
	        return { uri: uri };
	      } else {
	        return uri;
	      }
	    });
	
	    var requestData = {
	      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks',
	      type: 'DELETE',
	      postData: {
	        tracks: dataToBeSent,
	        snapshot_id: snapshotId
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, {}, callback);
	  };
	
	  /**
	   * Remove tracks from a playlist, specifying the positions of the tracks to be removed.
	   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
	   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
	   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
	   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
	   * @param {Array<number>} positions array of integers containing the positions of the tracks to remove
	   * from the playlist.
	   * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.removeTracksFromPlaylistInPositions = function(userId, playlistId, positions, snapshotId, callback) {
	    /*jshint camelcase: false */
	    var requestData = {
	      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks',
	      type: 'DELETE',
	      postData: {
	        positions: positions,
	        snapshot_id: snapshotId
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, {}, callback);
	  };
	
	  /**
	   * Fetches an album from the Spotify catalog.
	   * See [Get an Album](https://developer.spotify.com/web-api/get-album/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
	   * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getAlbum = function(albumId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/albums/' + albumId
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches the tracks of an album from the Spotify catalog.
	   * See [Get an Album's Tracks](https://developer.spotify.com/web-api/get-albums-tracks/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
	   * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getAlbumTracks = function(albumId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/albums/' + albumId + '/tracks'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches multiple albums from the Spotify catalog.
	   * See [Get Several Albums](https://developer.spotify.com/web-api/get-several-albums/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI it is easy
	   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getAlbums = function(albumIds, options, callback) {
	    var requestData = {
	      url: _baseUri + '/albums/',
	      params: { ids: albumIds.join(',') }
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches a track from the Spotify catalog.
	   * See [Get a Track](https://developer.spotify.com/web-api/get-track/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
	   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getTrack = function(trackId, options, callback) {
	    var requestData = {};
	    requestData.url = _baseUri + '/tracks/' + trackId;
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches multiple tracks from the Spotify catalog.
	   * See [Get Several Tracks](https://developer.spotify.com/web-api/get-several-tracks/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
	   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getTracks = function(trackIds, options, callback) {
	    var requestData = {
	      url: _baseUri + '/tracks/',
	      params: { ids: trackIds.join(',') }
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches an artist from the Spotify catalog.
	   * See [Get an Artist](https://developer.spotify.com/web-api/get-artist/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
	   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getArtist = function(artistId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/artists/' + artistId
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches multiple artists from the Spotify catalog.
	   * See [Get Several Artists](https://developer.spotify.com/web-api/get-several-artists/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
	   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getArtists = function(artistIds, options, callback) {
	    var requestData = {
	      url: _baseUri + '/artists/',
	      params: { ids: artistIds.join(',') }
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches the albums of an artist from the Spotify catalog.
	   * See [Get an Artist's Albums](https://developer.spotify.com/web-api/get-artists-albums/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
	   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getArtistAlbums = function(artistId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/artists/' + artistId + '/albums'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches a list of top tracks of an artist from the Spotify catalog, for a specific country.
	   * See [Get an Artist's Top Tracks](https://developer.spotify.com/web-api/get-artists-top-tracks/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
	   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
	   * @param {string} countryId The id of the country (e.g. ES for Spain or US for United States)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getArtistTopTracks = function(artistId, countryId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/artists/' + artistId + '/top-tracks',
	      params: { country: countryId }
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches a list of artists related with a given one from the Spotify catalog.
	   * See [Get an Artist's Related Artists](https://developer.spotify.com/web-api/get-related-artists/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
	   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getArtistRelatedArtists = function(artistId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/artists/' + artistId + '/related-artists'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches a list of Spotify featured playlists (shown, for example, on a Spotify player's "Browse" tab).
	   * See [Get a List of Featured Playlists](https://developer.spotify.com/web-api/get-list-featured-playlists/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getFeaturedPlaylists = function(options, callback) {
	    var requestData = {
	      url: _baseUri + '/browse/featured-playlists'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
	   * See [Get a List of New Releases](https://developer.spotify.com/web-api/get-list-new-releases/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getNewReleases = function(options, callback) {
	    var requestData = {
	      url: _baseUri + '/browse/new-releases'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
	   * See [Get a List of Categories](https://developer.spotify.com/web-api/get-list-categories/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getCategories = function(options, callback) {
	    var requestData = {
	      url: _baseUri + '/browse/categories'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
	   * See [Get a Category](https://developer.spotify.com/web-api/get-category/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} categoryId The id of the category. These can be found with the getCategories function
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getCategory = function(categoryId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/browse/categories/' + categoryId
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Get a list of Spotify playlists tagged with a particular category.
	   * See [Get a Category's Playlists](https://developer.spotify.com/web-api/get-categorys-playlists/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} categoryId The id of the category. These can be found with the getCategories function
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getCategoryPlaylists = function(categoryId, options, callback) {
	    var requestData = {
	      url: _baseUri + '/browse/categories/' + categoryId + '/playlists'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Get Spotify catalog information about artists, albums, tracks or playlists that match a keyword string.
	   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} query The search query
	   * @param {Array<string>} types An array of item types to search across.
	   * Valid types are: 'album', 'artist', 'playlist', and 'track'.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.search = function(query, types, options, callback) {
	    var requestData = {
	      url: _baseUri + '/search/',
	      params: {
	        q: query,
	        type: types.join(',')
	      }
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Fetches albums from the Spotify catalog according to a query.
	   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} query The search query
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.searchAlbums = function(query, options, callback) {
	    return this.search(query, ['album'], options, callback);
	  };
	
	  /**
	   * Fetches artists from the Spotify catalog according to a query.
	   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} query The search query
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.searchArtists = function(query, options, callback) {
	    return this.search(query, ['artist'], options, callback);
	  };
	
	  /**
	   * Fetches tracks from the Spotify catalog according to a query.
	   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} query The search query
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.searchTracks = function(query, options, callback) {
	    return this.search(query, ['track'], options, callback);
	  };
	
	  /**
	   * Fetches playlists from the Spotify catalog according to a query.
	   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} query The search query
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.searchPlaylists = function(query, options, callback) {
	    return this.search(query, ['playlist'], options, callback);
	  };
	
	  /**
	   * Get audio features for a single track identified by its unique Spotify ID.
	   * See [Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
	   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getAudioFeaturesForTrack = function(trackId, callback) {
	    var requestData = {};
	    requestData.url = _baseUri + '/audio-features/' + trackId;
	    return _checkParamsAndPerformRequest(requestData, {}, callback);
	  };
	
	  /**
	   * Get audio features for multiple tracks based on their Spotify IDs.
	   * See [Get Audio Features for Several Tracks](https://developer.spotify.com/web-api/get-several-audio-features/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
	   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getAudioFeaturesForTracks = function(trackIds, callback) {
	    var requestData = {
	      url: _baseUri + '/audio-features',
	      params: { ids: trackIds }
	    };
	    return _checkParamsAndPerformRequest(requestData, {}, callback);
	  };
	
	  /**
	   * Create a playlist-style listening experience based on seed artists, tracks and genres.
	   * See [Get Recommendations Based on Seeds](https://developer.spotify.com/web-api/get-recommendations/) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {Object} options A JSON object with options that can be passed
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getRecommendations = function(options, callback) {
	    var requestData = {
	      url: _baseUri + '/recommendations'
	    };
	    return _checkParamsAndPerformRequest(requestData, options, callback);
	  };
	
	  /**
	   * Retrieve a list of available genres seed parameter values for recommendations.
	   * See [Available Genre Seeds](https://developer.spotify.com/web-api/get-recommendations/#available-genre-seeds) on
	   * the Spotify Developer site for more information about the endpoint.
	   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
	   * one is the error object (null if no error), and the second is the value if the request succeeded.
	   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
	   */
	  Constr.prototype.getAvailableGenreSeeds = function(callback) {
	    var requestData = {
	      url: _baseUri + '/recommendations/available-genre-seeds'
	    };
	    return _checkParamsAndPerformRequest(requestData, {}, callback);
	  };
	
	  /**
	   * Gets the access token in use.
	   * @return {string} accessToken The access token
	   */
	  Constr.prototype.getAccessToken = function() {
	    return _accessToken;
	  };
	
	  /**
	   * Sets the access token to be used.
	   * See [the Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/) on
	   * the Spotify Developer site for more information about obtaining an access token.
	   * @param {string} accessToken The access token
	   * @return {void}
	   */
	  Constr.prototype.setAccessToken = function(accessToken) {
	    _accessToken = accessToken;
	  };
	
	  /**
	   * Sets an implementation of Promises/A+ to be used. E.g. Q, when.
	   * See [Conformant Implementations](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md)
	   * for a list of some available options
	   * @param {Object} promiseImplementation A Promises/A+ valid implementation
	   * @throws {Error} If the implementation being set doesn't conform with Promises/A+
	   * @return {void}
	   */
	  Constr.prototype.setPromiseImplementation = function(promiseImplementation) {
	    var valid = false;
	    try {
	      var p = new promiseImplementation(function(resolve, reject) { resolve(); });
	      if (typeof p.then === 'function' && typeof p.catch === 'function') {
	        valid = true;
	      }
	    } catch(e) {
	
	    }
	    if (valid) {
	      _promiseImplementation = promiseImplementation;
	    } else {
	      throw new Error('Unsupported implementation of Promises/A+');
	    }
	  };
	
	  return Constr;
	})();
	
	if (typeof module === 'object' && typeof module.exports === 'object') {
	  module.exports = SpotifyWebApi;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// vim:ts=4:sts=4:sw=4:
	/*!
	 *
	 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
	 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
	 *
	 * With parts by Tyler Close
	 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
	 * at http://www.opensource.org/licenses/mit-license.html
	 * Forked at ref_send.js version: 2009-05-11
	 *
	 * With parts by Mark Miller
	 * Copyright (C) 2011 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */
	
	(function (definition) {
	    "use strict";
	
	    // This file will function properly as a <script> tag, or a module
	    // using CommonJS and NodeJS or RequireJS module formats.  In
	    // Common/Node/RequireJS, the module exports the Q API and when
	    // executed as a simple <script>, it creates a Q global instead.
	
	    // Montage Require
	    if (typeof bootstrap === "function") {
	        bootstrap("promise", definition);
	
	    // CommonJS
	    } else if (true) {
	        module.exports = definition();
	
	    // RequireJS
	    } else if (typeof define === "function" && define.amd) {
	        define(definition);
	
	    // SES (Secure EcmaScript)
	    } else if (typeof ses !== "undefined") {
	        if (!ses.ok()) {
	            return;
	        } else {
	            ses.makeQ = definition;
	        }
	
	    // <script>
	    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
	        // Prefer window over self for add-on scripts. Use self for
	        // non-windowed contexts.
	        var global = typeof window !== "undefined" ? window : self;
	
	        // Get the `window` object, save the previous Q global
	        // and initialize Q as a global.
	        var previousQ = global.Q;
	        global.Q = definition();
	
	        // Add a noConflict function so Q can be removed from the
	        // global namespace.
	        global.Q.noConflict = function () {
	            global.Q = previousQ;
	            return this;
	        };
	
	    } else {
	        throw new Error("This environment was not anticipated by Q. Please file a bug.");
	    }
	
	})(function () {
	"use strict";
	
	var hasStacks = false;
	try {
	    throw new Error();
	} catch (e) {
	    hasStacks = !!e.stack;
	}
	
	// All code after this point will be filtered from stack traces reported
	// by Q.
	var qStartingLine = captureLine();
	var qFileName;
	
	// shims
	
	// used for fallback in "allResolved"
	var noop = function () {};
	
	// Use the fastest possible means to execute a task in a future turn
	// of the event loop.
	var nextTick =(function () {
	    // linked list of tasks (single, with head node)
	    var head = {task: void 0, next: null};
	    var tail = head;
	    var flushing = false;
	    var requestTick = void 0;
	    var isNodeJS = false;
	    // queue for late tasks, used by unhandled rejection tracking
	    var laterQueue = [];
	
	    function flush() {
	        /* jshint loopfunc: true */
	        var task, domain;
	
	        while (head.next) {
	            head = head.next;
	            task = head.task;
	            head.task = void 0;
	            domain = head.domain;
	
	            if (domain) {
	                head.domain = void 0;
	                domain.enter();
	            }
	            runSingle(task, domain);
	
	        }
	        while (laterQueue.length) {
	            task = laterQueue.pop();
	            runSingle(task);
	        }
	        flushing = false;
	    }
	    // runs a single function in the async queue
	    function runSingle(task, domain) {
	        try {
	            task();
	
	        } catch (e) {
	            if (isNodeJS) {
	                // In node, uncaught exceptions are considered fatal errors.
	                // Re-throw them synchronously to interrupt flushing!
	
	                // Ensure continuation if the uncaught exception is suppressed
	                // listening "uncaughtException" events (as domains does).
	                // Continue in next event to avoid tick recursion.
	                if (domain) {
	                    domain.exit();
	                }
	                setTimeout(flush, 0);
	                if (domain) {
	                    domain.enter();
	                }
	
	                throw e;
	
	            } else {
	                // In browsers, uncaught exceptions are not fatal.
	                // Re-throw them asynchronously to avoid slow-downs.
	                setTimeout(function () {
	                    throw e;
	                }, 0);
	            }
	        }
	
	        if (domain) {
	            domain.exit();
	        }
	    }
	
	    nextTick = function (task) {
	        tail = tail.next = {
	            task: task,
	            domain: isNodeJS && process.domain,
	            next: null
	        };
	
	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };
	
	    if (typeof process === "object" &&
	        process.toString() === "[object process]" && process.nextTick) {
	        // Ensure Q is in a real Node environment, with a `process.nextTick`.
	        // To see through fake Node environments:
	        // * Mocha test runner - exposes a `process` global without a `nextTick`
	        // * Browserify - exposes a `process.nexTick` function that uses
	        //   `setTimeout`. In this case `setImmediate` is preferred because
	        //    it is faster. Browserify's `process.toString()` yields
	        //   "[object Object]", while in a real Node environment
	        //   `process.nextTick()` yields "[object process]".
	        isNodeJS = true;
	
	        requestTick = function () {
	            process.nextTick(flush);
	        };
	
	    } else if (typeof setImmediate === "function") {
	        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
	        if (typeof window !== "undefined") {
	            requestTick = setImmediate.bind(window, flush);
	        } else {
	            requestTick = function () {
	                setImmediate(flush);
	            };
	        }
	
	    } else if (typeof MessageChannel !== "undefined") {
	        // modern browsers
	        // http://www.nonblocking.io/2011/06/windownexttick.html
	        var channel = new MessageChannel();
	        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
	        // working message ports the first time a page loads.
	        channel.port1.onmessage = function () {
	            requestTick = requestPortTick;
	            channel.port1.onmessage = flush;
	            flush();
	        };
	        var requestPortTick = function () {
	            // Opera requires us to provide a message payload, regardless of
	            // whether we use it.
	            channel.port2.postMessage(0);
	        };
	        requestTick = function () {
	            setTimeout(flush, 0);
	            requestPortTick();
	        };
	
	    } else {
	        // old browsers
	        requestTick = function () {
	            setTimeout(flush, 0);
	        };
	    }
	    // runs a task after all other tasks have been run
	    // this is useful for unhandled rejection tracking that needs to happen
	    // after all `then`d tasks have been run.
	    nextTick.runAfter = function (task) {
	        laterQueue.push(task);
	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };
	    return nextTick;
	})();
	
	// Attempt to make generics safe in the face of downstream
	// modifications.
	// There is no situation where this is necessary.
	// If you need a security guarantee, these primordials need to be
	// deeply frozen anyway, and if you don’t need a security guarantee,
	// this is just plain paranoid.
	// However, this **might** have the nice side-effect of reducing the size of
	// the minified code by reducing x.call() to merely x()
	// See Mark Miller’s explanation of what this does.
	// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
	var call = Function.call;
	function uncurryThis(f) {
	    return function () {
	        return call.apply(f, arguments);
	    };
	}
	// This is equivalent, but slower:
	// uncurryThis = Function_bind.bind(Function_bind.call);
	// http://jsperf.com/uncurrythis
	
	var array_slice = uncurryThis(Array.prototype.slice);
	
	var array_reduce = uncurryThis(
	    Array.prototype.reduce || function (callback, basis) {
	        var index = 0,
	            length = this.length;
	        // concerning the initial value, if one is not provided
	        if (arguments.length === 1) {
	            // seek to the first value in the array, accounting
	            // for the possibility that is is a sparse array
	            do {
	                if (index in this) {
	                    basis = this[index++];
	                    break;
	                }
	                if (++index >= length) {
	                    throw new TypeError();
	                }
	            } while (1);
	        }
	        // reduce
	        for (; index < length; index++) {
	            // account for the possibility that the array is sparse
	            if (index in this) {
	                basis = callback(basis, this[index], index);
	            }
	        }
	        return basis;
	    }
	);
	
	var array_indexOf = uncurryThis(
	    Array.prototype.indexOf || function (value) {
	        // not a very good shim, but good enough for our one use of it
	        for (var i = 0; i < this.length; i++) {
	            if (this[i] === value) {
	                return i;
	            }
	        }
	        return -1;
	    }
	);
	
	var array_map = uncurryThis(
	    Array.prototype.map || function (callback, thisp) {
	        var self = this;
	        var collect = [];
	        array_reduce(self, function (undefined, value, index) {
	            collect.push(callback.call(thisp, value, index, self));
	        }, void 0);
	        return collect;
	    }
	);
	
	var object_create = Object.create || function (prototype) {
	    function Type() { }
	    Type.prototype = prototype;
	    return new Type();
	};
	
	var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
	
	var object_keys = Object.keys || function (object) {
	    var keys = [];
	    for (var key in object) {
	        if (object_hasOwnProperty(object, key)) {
	            keys.push(key);
	        }
	    }
	    return keys;
	};
	
	var object_toString = uncurryThis(Object.prototype.toString);
	
	function isObject(value) {
	    return value === Object(value);
	}
	
	// generator related shims
	
	// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
	function isStopIteration(exception) {
	    return (
	        object_toString(exception) === "[object StopIteration]" ||
	        exception instanceof QReturnValue
	    );
	}
	
	// FIXME: Remove this helper and Q.return once ES6 generators are in
	// SpiderMonkey.
	var QReturnValue;
	if (typeof ReturnValue !== "undefined") {
	    QReturnValue = ReturnValue;
	} else {
	    QReturnValue = function (value) {
	        this.value = value;
	    };
	}
	
	// long stack traces
	
	var STACK_JUMP_SEPARATOR = "From previous event:";
	
	function makeStackTraceLong(error, promise) {
	    // If possible, transform the error stack trace by removing Node and Q
	    // cruft, then concatenating with the stack trace of `promise`. See #57.
	    if (hasStacks &&
	        promise.stack &&
	        typeof error === "object" &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	        var stacks = [];
	        for (var p = promise; !!p; p = p.source) {
	            if (p.stack) {
	                stacks.unshift(p.stack);
	            }
	        }
	        stacks.unshift(error.stack);
	
	        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
	        error.stack = filterStackString(concatedStacks);
	    }
	}
	
	function filterStackString(stackString) {
	    var lines = stackString.split("\n");
	    var desiredLines = [];
	    for (var i = 0; i < lines.length; ++i) {
	        var line = lines[i];
	
	        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	            desiredLines.push(line);
	        }
	    }
	    return desiredLines.join("\n");
	}
	
	function isNodeFrame(stackLine) {
	    return stackLine.indexOf("(module.js:") !== -1 ||
	           stackLine.indexOf("(node.js:") !== -1;
	}
	
	function getFileNameAndLineNumber(stackLine) {
	    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
	    // In IE10 function name can have spaces ("Anonymous function") O_o
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) {
	        return [attempt1[1], Number(attempt1[2])];
	    }
	
	    // Anonymous functions: "at filename:lineNumber:columnNumber"
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) {
	        return [attempt2[1], Number(attempt2[2])];
	    }
	
	    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) {
	        return [attempt3[1], Number(attempt3[2])];
	    }
	}
	
	function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
	
	    if (!fileNameAndLineNumber) {
	        return false;
	    }
	
	    var fileName = fileNameAndLineNumber[0];
	    var lineNumber = fileNameAndLineNumber[1];
	
	    return fileName === qFileName &&
	        lineNumber >= qStartingLine &&
	        lineNumber <= qEndingLine;
	}
	
	// discover own file name and line number range for filtering stack
	// traces
	function captureLine() {
	    if (!hasStacks) {
	        return;
	    }
	
	    try {
	        throw new Error();
	    } catch (e) {
	        var lines = e.stack.split("\n");
	        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
	        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	        if (!fileNameAndLineNumber) {
	            return;
	        }
	
	        qFileName = fileNameAndLineNumber[0];
	        return fileNameAndLineNumber[1];
	    }
	}
	
	function deprecate(callback, name, alternative) {
	    return function () {
	        if (typeof console !== "undefined" &&
	            typeof console.warn === "function") {
	            console.warn(name + " is deprecated, use " + alternative +
	                         " instead.", new Error("").stack);
	        }
	        return callback.apply(callback, arguments);
	    };
	}
	
	// end of shims
	// beginning of real work
	
	/**
	 * Constructs a promise for an immediate reference, passes promises through, or
	 * coerces promises from different systems.
	 * @param value immediate reference or promise
	 */
	function Q(value) {
	    // If the object is already a Promise, return it directly.  This enables
	    // the resolve function to both be used to created references from objects,
	    // but to tolerably coerce non-promises to promises.
	    if (value instanceof Promise) {
	        return value;
	    }
	
	    // assimilate thenables
	    if (isPromiseAlike(value)) {
	        return coerce(value);
	    } else {
	        return fulfill(value);
	    }
	}
	Q.resolve = Q;
	
	/**
	 * Performs a task in a future turn of the event loop.
	 * @param {Function} task
	 */
	Q.nextTick = nextTick;
	
	/**
	 * Controls whether or not long stack traces will be on
	 */
	Q.longStackSupport = false;
	
	// enable long stacks if Q_DEBUG is set
	if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
	    Q.longStackSupport = true;
	}
	
	/**
	 * Constructs a {promise, resolve, reject} object.
	 *
	 * `resolve` is a callback to invoke with a more resolved value for the
	 * promise. To fulfill the promise, invoke `resolve` with any value that is
	 * not a thenable. To reject the promise, invoke `resolve` with a rejected
	 * thenable, or invoke `reject` with the reason directly. To resolve the
	 * promise to another thenable, thus putting it in the same state, invoke
	 * `resolve` with that other thenable.
	 */
	Q.defer = defer;
	function defer() {
	    // if "messages" is an "Array", that indicates that the promise has not yet
	    // been resolved.  If it is "undefined", it has been resolved.  Each
	    // element of the messages array is itself an array of complete arguments to
	    // forward to the resolved promise.  We coerce the resolution value to a
	    // promise using the `resolve` function because it handles both fully
	    // non-thenable values and other thenables gracefully.
	    var messages = [], progressListeners = [], resolvedPromise;
	
	    var deferred = object_create(defer.prototype);
	    var promise = object_create(Promise.prototype);
	
	    promise.promiseDispatch = function (resolve, op, operands) {
	        var args = array_slice(arguments);
	        if (messages) {
	            messages.push(args);
	            if (op === "when" && operands[1]) { // progress operand
	                progressListeners.push(operands[1]);
	            }
	        } else {
	            Q.nextTick(function () {
	                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
	            });
	        }
	    };
	
	    // XXX deprecated
	    promise.valueOf = function () {
	        if (messages) {
	            return promise;
	        }
	        var nearerValue = nearer(resolvedPromise);
	        if (isPromise(nearerValue)) {
	            resolvedPromise = nearerValue; // shorten chain
	        }
	        return nearerValue;
	    };
	
	    promise.inspect = function () {
	        if (!resolvedPromise) {
	            return { state: "pending" };
	        }
	        return resolvedPromise.inspect();
	    };
	
	    if (Q.longStackSupport && hasStacks) {
	        try {
	            throw new Error();
	        } catch (e) {
	            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
	            // accessor around; that causes memory leaks as per GH-111. Just
	            // reify the stack trace as a string ASAP.
	            //
	            // At the same time, cut off the first line; it's always just
	            // "[object Promise]\n", as per the `toString`.
	            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
	        }
	    }
	
	    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
	    // consolidating them into `become`, since otherwise we'd create new
	    // promises with the lines `become(whatever(value))`. See e.g. GH-252.
	
	    function become(newPromise) {
	        resolvedPromise = newPromise;
	        promise.source = newPromise;
	
	        array_reduce(messages, function (undefined, message) {
	            Q.nextTick(function () {
	                newPromise.promiseDispatch.apply(newPromise, message);
	            });
	        }, void 0);
	
	        messages = void 0;
	        progressListeners = void 0;
	    }
	
	    deferred.promise = promise;
	    deferred.resolve = function (value) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        become(Q(value));
	    };
	
	    deferred.fulfill = function (value) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        become(fulfill(value));
	    };
	    deferred.reject = function (reason) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        become(reject(reason));
	    };
	    deferred.notify = function (progress) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        array_reduce(progressListeners, function (undefined, progressListener) {
	            Q.nextTick(function () {
	                progressListener(progress);
	            });
	        }, void 0);
	    };
	
	    return deferred;
	}
	
	/**
	 * Creates a Node-style callback that will resolve or reject the deferred
	 * promise.
	 * @returns a nodeback
	 */
	defer.prototype.makeNodeResolver = function () {
	    var self = this;
	    return function (error, value) {
	        if (error) {
	            self.reject(error);
	        } else if (arguments.length > 2) {
	            self.resolve(array_slice(arguments, 1));
	        } else {
	            self.resolve(value);
	        }
	    };
	};
	
	/**
	 * @param resolver {Function} a function that returns nothing and accepts
	 * the resolve, reject, and notify functions for a deferred.
	 * @returns a promise that may be resolved with the given resolve and reject
	 * functions, or rejected by a thrown exception in resolver
	 */
	Q.Promise = promise; // ES6
	Q.promise = promise;
	function promise(resolver) {
	    if (typeof resolver !== "function") {
	        throw new TypeError("resolver must be a function.");
	    }
	    var deferred = defer();
	    try {
	        resolver(deferred.resolve, deferred.reject, deferred.notify);
	    } catch (reason) {
	        deferred.reject(reason);
	    }
	    return deferred.promise;
	}
	
	promise.race = race; // ES6
	promise.all = all; // ES6
	promise.reject = reject; // ES6
	promise.resolve = Q; // ES6
	
	// XXX experimental.  This method is a way to denote that a local value is
	// serializable and should be immediately dispatched to a remote upon request,
	// instead of passing a reference.
	Q.passByCopy = function (object) {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return object;
	};
	
	Promise.prototype.passByCopy = function () {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return this;
	};
	
	/**
	 * If two promises eventually fulfill to the same value, promises that value,
	 * but otherwise rejects.
	 * @param x {Any*}
	 * @param y {Any*}
	 * @returns {Any*} a promise for x and y if they are the same, but a rejection
	 * otherwise.
	 *
	 */
	Q.join = function (x, y) {
	    return Q(x).join(y);
	};
	
	Promise.prototype.join = function (that) {
	    return Q([this, that]).spread(function (x, y) {
	        if (x === y) {
	            // TODO: "===" should be Object.is or equiv
	            return x;
	        } else {
	            throw new Error("Can't join: not the same: " + x + " " + y);
	        }
	    });
	};
	
	/**
	 * Returns a promise for the first of an array of promises to become settled.
	 * @param answers {Array[Any*]} promises to race
	 * @returns {Any*} the first promise to be settled
	 */
	Q.race = race;
	function race(answerPs) {
	    return promise(function (resolve, reject) {
	        // Switch to this once we can assume at least ES5
	        // answerPs.forEach(function (answerP) {
	        //     Q(answerP).then(resolve, reject);
	        // });
	        // Use this in the meantime
	        for (var i = 0, len = answerPs.length; i < len; i++) {
	            Q(answerPs[i]).then(resolve, reject);
	        }
	    });
	}
	
	Promise.prototype.race = function () {
	    return this.then(Q.race);
	};
	
	/**
	 * Constructs a Promise with a promise descriptor object and optional fallback
	 * function.  The descriptor contains methods like when(rejected), get(name),
	 * set(name, value), post(name, args), and delete(name), which all
	 * return either a value, a promise for a value, or a rejection.  The fallback
	 * accepts the operation name, a resolver, and any further arguments that would
	 * have been forwarded to the appropriate method above had a method been
	 * provided with the proper name.  The API makes no guarantees about the nature
	 * of the returned object, apart from that it is usable whereever promises are
	 * bought and sold.
	 */
	Q.makePromise = Promise;
	function Promise(descriptor, fallback, inspect) {
	    if (fallback === void 0) {
	        fallback = function (op) {
	            return reject(new Error(
	                "Promise does not support operation: " + op
	            ));
	        };
	    }
	    if (inspect === void 0) {
	        inspect = function () {
	            return {state: "unknown"};
	        };
	    }
	
	    var promise = object_create(Promise.prototype);
	
	    promise.promiseDispatch = function (resolve, op, args) {
	        var result;
	        try {
	            if (descriptor[op]) {
	                result = descriptor[op].apply(promise, args);
	            } else {
	                result = fallback.call(promise, op, args);
	            }
	        } catch (exception) {
	            result = reject(exception);
	        }
	        if (resolve) {
	            resolve(result);
	        }
	    };
	
	    promise.inspect = inspect;
	
	    // XXX deprecated `valueOf` and `exception` support
	    if (inspect) {
	        var inspected = inspect();
	        if (inspected.state === "rejected") {
	            promise.exception = inspected.reason;
	        }
	
	        promise.valueOf = function () {
	            var inspected = inspect();
	            if (inspected.state === "pending" ||
	                inspected.state === "rejected") {
	                return promise;
	            }
	            return inspected.value;
	        };
	    }
	
	    return promise;
	}
	
	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};
	
	Promise.prototype.then = function (fulfilled, rejected, progressed) {
	    var self = this;
	    var deferred = defer();
	    var done = false;   // ensure the untrusted promise makes at most a
	                        // single call to one of the callbacks
	
	    function _fulfilled(value) {
	        try {
	            return typeof fulfilled === "function" ? fulfilled(value) : value;
	        } catch (exception) {
	            return reject(exception);
	        }
	    }
	
	    function _rejected(exception) {
	        if (typeof rejected === "function") {
	            makeStackTraceLong(exception, self);
	            try {
	                return rejected(exception);
	            } catch (newException) {
	                return reject(newException);
	            }
	        }
	        return reject(exception);
	    }
	
	    function _progressed(value) {
	        return typeof progressed === "function" ? progressed(value) : value;
	    }
	
	    Q.nextTick(function () {
	        self.promiseDispatch(function (value) {
	            if (done) {
	                return;
	            }
	            done = true;
	
	            deferred.resolve(_fulfilled(value));
	        }, "when", [function (exception) {
	            if (done) {
	                return;
	            }
	            done = true;
	
	            deferred.resolve(_rejected(exception));
	        }]);
	    });
	
	    // Progress propagator need to be attached in the current tick.
	    self.promiseDispatch(void 0, "when", [void 0, function (value) {
	        var newValue;
	        var threw = false;
	        try {
	            newValue = _progressed(value);
	        } catch (e) {
	            threw = true;
	            if (Q.onerror) {
	                Q.onerror(e);
	            } else {
	                throw e;
	            }
	        }
	
	        if (!threw) {
	            deferred.notify(newValue);
	        }
	    }]);
	
	    return deferred.promise;
	};
	
	Q.tap = function (promise, callback) {
	    return Q(promise).tap(callback);
	};
	
	/**
	 * Works almost like "finally", but not called for rejections.
	 * Original resolution value is passed through callback unaffected.
	 * Callback may return a promise that will be awaited for.
	 * @param {Function} callback
	 * @returns {Q.Promise}
	 * @example
	 * doSomething()
	 *   .then(...)
	 *   .tap(console.log)
	 *   .then(...);
	 */
	Promise.prototype.tap = function (callback) {
	    callback = Q(callback);
	
	    return this.then(function (value) {
	        return callback.fcall(value).thenResolve(value);
	    });
	};
	
	/**
	 * Registers an observer on a promise.
	 *
	 * Guarantees:
	 *
	 * 1. that fulfilled and rejected will be called only once.
	 * 2. that either the fulfilled callback or the rejected callback will be
	 *    called, but not both.
	 * 3. that fulfilled and rejected will not be called in this turn.
	 *
	 * @param value      promise or immediate reference to observe
	 * @param fulfilled  function to be called with the fulfilled value
	 * @param rejected   function to be called with the rejection exception
	 * @param progressed function to be called on any progress notifications
	 * @return promise for the return value from the invoked callback
	 */
	Q.when = when;
	function when(value, fulfilled, rejected, progressed) {
	    return Q(value).then(fulfilled, rejected, progressed);
	}
	
	Promise.prototype.thenResolve = function (value) {
	    return this.then(function () { return value; });
	};
	
	Q.thenResolve = function (promise, value) {
	    return Q(promise).thenResolve(value);
	};
	
	Promise.prototype.thenReject = function (reason) {
	    return this.then(function () { throw reason; });
	};
	
	Q.thenReject = function (promise, reason) {
	    return Q(promise).thenReject(reason);
	};
	
	/**
	 * If an object is not a promise, it is as "near" as possible.
	 * If a promise is rejected, it is as "near" as possible too.
	 * If it’s a fulfilled promise, the fulfillment value is nearer.
	 * If it’s a deferred promise and the deferred has been resolved, the
	 * resolution is "nearer".
	 * @param object
	 * @returns most resolved (nearest) form of the object
	 */
	
	// XXX should we re-do this?
	Q.nearer = nearer;
	function nearer(value) {
	    if (isPromise(value)) {
	        var inspected = value.inspect();
	        if (inspected.state === "fulfilled") {
	            return inspected.value;
	        }
	    }
	    return value;
	}
	
	/**
	 * @returns whether the given object is a promise.
	 * Otherwise it is a fulfilled value.
	 */
	Q.isPromise = isPromise;
	function isPromise(object) {
	    return object instanceof Promise;
	}
	
	Q.isPromiseAlike = isPromiseAlike;
	function isPromiseAlike(object) {
	    return isObject(object) && typeof object.then === "function";
	}
	
	/**
	 * @returns whether the given object is a pending promise, meaning not
	 * fulfilled or rejected.
	 */
	Q.isPending = isPending;
	function isPending(object) {
	    return isPromise(object) && object.inspect().state === "pending";
	}
	
	Promise.prototype.isPending = function () {
	    return this.inspect().state === "pending";
	};
	
	/**
	 * @returns whether the given object is a value or fulfilled
	 * promise.
	 */
	Q.isFulfilled = isFulfilled;
	function isFulfilled(object) {
	    return !isPromise(object) || object.inspect().state === "fulfilled";
	}
	
	Promise.prototype.isFulfilled = function () {
	    return this.inspect().state === "fulfilled";
	};
	
	/**
	 * @returns whether the given object is a rejected promise.
	 */
	Q.isRejected = isRejected;
	function isRejected(object) {
	    return isPromise(object) && object.inspect().state === "rejected";
	}
	
	Promise.prototype.isRejected = function () {
	    return this.inspect().state === "rejected";
	};
	
	//// BEGIN UNHANDLED REJECTION TRACKING
	
	// This promise library consumes exceptions thrown in handlers so they can be
	// handled by a subsequent promise.  The exceptions get added to this array when
	// they are created, and removed when they are handled.  Note that in ES6 or
	// shimmed environments, this would naturally be a `Set`.
	var unhandledReasons = [];
	var unhandledRejections = [];
	var reportedUnhandledRejections = [];
	var trackUnhandledRejections = true;
	
	function resetUnhandledRejections() {
	    unhandledReasons.length = 0;
	    unhandledRejections.length = 0;
	
	    if (!trackUnhandledRejections) {
	        trackUnhandledRejections = true;
	    }
	}
	
	function trackRejection(promise, reason) {
	    if (!trackUnhandledRejections) {
	        return;
	    }
	    if (typeof process === "object" && typeof process.emit === "function") {
	        Q.nextTick.runAfter(function () {
	            if (array_indexOf(unhandledRejections, promise) !== -1) {
	                process.emit("unhandledRejection", reason, promise);
	                reportedUnhandledRejections.push(promise);
	            }
	        });
	    }
	
	    unhandledRejections.push(promise);
	    if (reason && typeof reason.stack !== "undefined") {
	        unhandledReasons.push(reason.stack);
	    } else {
	        unhandledReasons.push("(no stack) " + reason);
	    }
	}
	
	function untrackRejection(promise) {
	    if (!trackUnhandledRejections) {
	        return;
	    }
	
	    var at = array_indexOf(unhandledRejections, promise);
	    if (at !== -1) {
	        if (typeof process === "object" && typeof process.emit === "function") {
	            Q.nextTick.runAfter(function () {
	                var atReport = array_indexOf(reportedUnhandledRejections, promise);
	                if (atReport !== -1) {
	                    process.emit("rejectionHandled", unhandledReasons[at], promise);
	                    reportedUnhandledRejections.splice(atReport, 1);
	                }
	            });
	        }
	        unhandledRejections.splice(at, 1);
	        unhandledReasons.splice(at, 1);
	    }
	}
	
	Q.resetUnhandledRejections = resetUnhandledRejections;
	
	Q.getUnhandledReasons = function () {
	    // Make a copy so that consumers can't interfere with our internal state.
	    return unhandledReasons.slice();
	};
	
	Q.stopUnhandledRejectionTracking = function () {
	    resetUnhandledRejections();
	    trackUnhandledRejections = false;
	};
	
	resetUnhandledRejections();
	
	//// END UNHANDLED REJECTION TRACKING
	
	/**
	 * Constructs a rejected promise.
	 * @param reason value describing the failure
	 */
	Q.reject = reject;
	function reject(reason) {
	    var rejection = Promise({
	        "when": function (rejected) {
	            // note that the error has been handled
	            if (rejected) {
	                untrackRejection(this);
	            }
	            return rejected ? rejected(reason) : this;
	        }
	    }, function fallback() {
	        return this;
	    }, function inspect() {
	        return { state: "rejected", reason: reason };
	    });
	
	    // Note that the reason has not been handled.
	    trackRejection(rejection, reason);
	
	    return rejection;
	}
	
	/**
	 * Constructs a fulfilled promise for an immediate reference.
	 * @param value immediate reference
	 */
	Q.fulfill = fulfill;
	function fulfill(value) {
	    return Promise({
	        "when": function () {
	            return value;
	        },
	        "get": function (name) {
	            return value[name];
	        },
	        "set": function (name, rhs) {
	            value[name] = rhs;
	        },
	        "delete": function (name) {
	            delete value[name];
	        },
	        "post": function (name, args) {
	            // Mark Miller proposes that post with no name should apply a
	            // promised function.
	            if (name === null || name === void 0) {
	                return value.apply(void 0, args);
	            } else {
	                return value[name].apply(value, args);
	            }
	        },
	        "apply": function (thisp, args) {
	            return value.apply(thisp, args);
	        },
	        "keys": function () {
	            return object_keys(value);
	        }
	    }, void 0, function inspect() {
	        return { state: "fulfilled", value: value };
	    });
	}
	
	/**
	 * Converts thenables to Q promises.
	 * @param promise thenable promise
	 * @returns a Q promise
	 */
	function coerce(promise) {
	    var deferred = defer();
	    Q.nextTick(function () {
	        try {
	            promise.then(deferred.resolve, deferred.reject, deferred.notify);
	        } catch (exception) {
	            deferred.reject(exception);
	        }
	    });
	    return deferred.promise;
	}
	
	/**
	 * Annotates an object such that it will never be
	 * transferred away from this process over any promise
	 * communication channel.
	 * @param object
	 * @returns promise a wrapping of that object that
	 * additionally responds to the "isDef" message
	 * without a rejection.
	 */
	Q.master = master;
	function master(object) {
	    return Promise({
	        "isDef": function () {}
	    }, function fallback(op, args) {
	        return dispatch(object, op, args);
	    }, function () {
	        return Q(object).inspect();
	    });
	}
	
	/**
	 * Spreads the values of a promised array of arguments into the
	 * fulfillment callback.
	 * @param fulfilled callback that receives variadic arguments from the
	 * promised array
	 * @param rejected callback that receives the exception if the promise
	 * is rejected.
	 * @returns a promise for the return value or thrown exception of
	 * either callback.
	 */
	Q.spread = spread;
	function spread(value, fulfilled, rejected) {
	    return Q(value).spread(fulfilled, rejected);
	}
	
	Promise.prototype.spread = function (fulfilled, rejected) {
	    return this.all().then(function (array) {
	        return fulfilled.apply(void 0, array);
	    }, rejected);
	};
	
	/**
	 * The async function is a decorator for generator functions, turning
	 * them into asynchronous generators.  Although generators are only part
	 * of the newest ECMAScript 6 drafts, this code does not cause syntax
	 * errors in older engines.  This code should continue to work and will
	 * in fact improve over time as the language improves.
	 *
	 * ES6 generators are currently part of V8 version 3.19 with the
	 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
	 * for longer, but under an older Python-inspired form.  This function
	 * works on both kinds of generators.
	 *
	 * Decorates a generator function such that:
	 *  - it may yield promises
	 *  - execution will continue when that promise is fulfilled
	 *  - the value of the yield expression will be the fulfilled value
	 *  - it returns a promise for the return value (when the generator
	 *    stops iterating)
	 *  - the decorated function returns a promise for the return value
	 *    of the generator or the first rejected promise among those
	 *    yielded.
	 *  - if an error is thrown in the generator, it propagates through
	 *    every following yield until it is caught, or until it escapes
	 *    the generator function altogether, and is translated into a
	 *    rejection for the promise returned by the decorated generator.
	 */
	Q.async = async;
	function async(makeGenerator) {
	    return function () {
	        // when verb is "send", arg is a value
	        // when verb is "throw", arg is an exception
	        function continuer(verb, arg) {
	            var result;
	
	            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
	            // engine that has a deployed base of browsers that support generators.
	            // However, SM's generators use the Python-inspired semantics of
	            // outdated ES6 drafts.  We would like to support ES6, but we'd also
	            // like to make it possible to use generators in deployed browsers, so
	            // we also support Python-style generators.  At some point we can remove
	            // this block.
	
	            if (typeof StopIteration === "undefined") {
	                // ES6 Generators
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    return reject(exception);
	                }
	                if (result.done) {
	                    return Q(result.value);
	                } else {
	                    return when(result.value, callback, errback);
	                }
	            } else {
	                // SpiderMonkey Generators
	                // FIXME: Remove this case when SM does ES6 generators.
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    if (isStopIteration(exception)) {
	                        return Q(exception.value);
	                    } else {
	                        return reject(exception);
	                    }
	                }
	                return when(result, callback, errback);
	            }
	        }
	        var generator = makeGenerator.apply(this, arguments);
	        var callback = continuer.bind(continuer, "next");
	        var errback = continuer.bind(continuer, "throw");
	        return callback();
	    };
	}
	
	/**
	 * The spawn function is a small wrapper around async that immediately
	 * calls the generator and also ends the promise chain, so that any
	 * unhandled errors are thrown instead of forwarded to the error
	 * handler. This is useful because it's extremely common to run
	 * generators at the top-level to work with libraries.
	 */
	Q.spawn = spawn;
	function spawn(makeGenerator) {
	    Q.done(Q.async(makeGenerator)());
	}
	
	// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
	/**
	 * Throws a ReturnValue exception to stop an asynchronous generator.
	 *
	 * This interface is a stop-gap measure to support generator return
	 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
	 * generators like Chromium 29, just use "return" in your generator
	 * functions.
	 *
	 * @param value the return value for the surrounding generator
	 * @throws ReturnValue exception with the value.
	 * @example
	 * // ES6 style
	 * Q.async(function* () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      return foo + bar;
	 * })
	 * // Older SpiderMonkey style
	 * Q.async(function () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      Q.return(foo + bar);
	 * })
	 */
	Q["return"] = _return;
	function _return(value) {
	    throw new QReturnValue(value);
	}
	
	/**
	 * The promised function decorator ensures that any promise arguments
	 * are settled and passed as values (`this` is also settled and passed
	 * as a value).  It will also ensure that the result of a function is
	 * always a promise.
	 *
	 * @example
	 * var add = Q.promised(function (a, b) {
	 *     return a + b;
	 * });
	 * add(Q(a), Q(B));
	 *
	 * @param {function} callback The function to decorate
	 * @returns {function} a function that has been decorated.
	 */
	Q.promised = promised;
	function promised(callback) {
	    return function () {
	        return spread([this, all(arguments)], function (self, args) {
	            return callback.apply(self, args);
	        });
	    };
	}
	
	/**
	 * sends a message to a value in a future turn
	 * @param object* the recipient
	 * @param op the name of the message operation, e.g., "when",
	 * @param args further arguments to be forwarded to the operation
	 * @returns result {Promise} a promise for the result of the operation
	 */
	Q.dispatch = dispatch;
	function dispatch(object, op, args) {
	    return Q(object).dispatch(op, args);
	}
	
	Promise.prototype.dispatch = function (op, args) {
	    var self = this;
	    var deferred = defer();
	    Q.nextTick(function () {
	        self.promiseDispatch(deferred.resolve, op, args);
	    });
	    return deferred.promise;
	};
	
	/**
	 * Gets the value of a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to get
	 * @return promise for the property value
	 */
	Q.get = function (object, key) {
	    return Q(object).dispatch("get", [key]);
	};
	
	Promise.prototype.get = function (key) {
	    return this.dispatch("get", [key]);
	};
	
	/**
	 * Sets the value of a property in a future turn.
	 * @param object    promise or immediate reference for object object
	 * @param name      name of property to set
	 * @param value     new value of property
	 * @return promise for the return value
	 */
	Q.set = function (object, key, value) {
	    return Q(object).dispatch("set", [key, value]);
	};
	
	Promise.prototype.set = function (key, value) {
	    return this.dispatch("set", [key, value]);
	};
	
	/**
	 * Deletes a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to delete
	 * @return promise for the return value
	 */
	Q.del = // XXX legacy
	Q["delete"] = function (object, key) {
	    return Q(object).dispatch("delete", [key]);
	};
	
	Promise.prototype.del = // XXX legacy
	Promise.prototype["delete"] = function (key) {
	    return this.dispatch("delete", [key]);
	};
	
	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param value     a value to post, typically an array of
	 *                  invocation arguments for promises that
	 *                  are ultimately backed with `resolve` values,
	 *                  as opposed to those backed with URLs
	 *                  wherein the posted value can be any
	 *                  JSON serializable object.
	 * @return promise for the return value
	 */
	// bound locally because it is used by other methods
	Q.mapply = // XXX As proposed by "Redsandro"
	Q.post = function (object, name, args) {
	    return Q(object).dispatch("post", [name, args]);
	};
	
	Promise.prototype.mapply = // XXX As proposed by "Redsandro"
	Promise.prototype.post = function (name, args) {
	    return this.dispatch("post", [name, args]);
	};
	
	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param ...args   array of invocation arguments
	 * @return promise for the return value
	 */
	Q.send = // XXX Mark Miller's proposed parlance
	Q.mcall = // XXX As proposed by "Redsandro"
	Q.invoke = function (object, name /*...args*/) {
	    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
	};
	
	Promise.prototype.send = // XXX Mark Miller's proposed parlance
	Promise.prototype.mcall = // XXX As proposed by "Redsandro"
	Promise.prototype.invoke = function (name /*...args*/) {
	    return this.dispatch("post", [name, array_slice(arguments, 1)]);
	};
	
	/**
	 * Applies the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param args      array of application arguments
	 */
	Q.fapply = function (object, args) {
	    return Q(object).dispatch("apply", [void 0, args]);
	};
	
	Promise.prototype.fapply = function (args) {
	    return this.dispatch("apply", [void 0, args]);
	};
	
	/**
	 * Calls the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q["try"] =
	Q.fcall = function (object /* ...args*/) {
	    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
	};
	
	Promise.prototype.fcall = function (/*...args*/) {
	    return this.dispatch("apply", [void 0, array_slice(arguments)]);
	};
	
	/**
	 * Binds the promised function, transforming return values into a fulfilled
	 * promise and thrown errors into a rejected one.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q.fbind = function (object /*...args*/) {
	    var promise = Q(object);
	    var args = array_slice(arguments, 1);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	Promise.prototype.fbind = function (/*...args*/) {
	    var promise = this;
	    var args = array_slice(arguments);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	
	/**
	 * Requests the names of the owned properties of a promised
	 * object in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @return promise for the keys of the eventually settled object
	 */
	Q.keys = function (object) {
	    return Q(object).dispatch("keys", []);
	};
	
	Promise.prototype.keys = function () {
	    return this.dispatch("keys", []);
	};
	
	/**
	 * Turns an array of promises into a promise for an array.  If any of
	 * the promises gets rejected, the whole array is rejected immediately.
	 * @param {Array*} an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns a promise for an array of the corresponding values
	 */
	// By Mark Miller
	// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
	Q.all = all;
	function all(promises) {
	    return when(promises, function (promises) {
	        var pendingCount = 0;
	        var deferred = defer();
	        array_reduce(promises, function (undefined, promise, index) {
	            var snapshot;
	            if (
	                isPromise(promise) &&
	                (snapshot = promise.inspect()).state === "fulfilled"
	            ) {
	                promises[index] = snapshot.value;
	            } else {
	                ++pendingCount;
	                when(
	                    promise,
	                    function (value) {
	                        promises[index] = value;
	                        if (--pendingCount === 0) {
	                            deferred.resolve(promises);
	                        }
	                    },
	                    deferred.reject,
	                    function (progress) {
	                        deferred.notify({ index: index, value: progress });
	                    }
	                );
	            }
	        }, void 0);
	        if (pendingCount === 0) {
	            deferred.resolve(promises);
	        }
	        return deferred.promise;
	    });
	}
	
	Promise.prototype.all = function () {
	    return all(this);
	};
	
	/**
	 * Returns the first resolved promise of an array. Prior rejected promises are
	 * ignored.  Rejects only if all promises are rejected.
	 * @param {Array*} an array containing values or promises for values
	 * @returns a promise fulfilled with the value of the first resolved promise,
	 * or a rejected promise if all promises are rejected.
	 */
	Q.any = any;
	
	function any(promises) {
	    if (promises.length === 0) {
	        return Q.resolve();
	    }
	
	    var deferred = Q.defer();
	    var pendingCount = 0;
	    array_reduce(promises, function (prev, current, index) {
	        var promise = promises[index];
	
	        pendingCount++;
	
	        when(promise, onFulfilled, onRejected, onProgress);
	        function onFulfilled(result) {
	            deferred.resolve(result);
	        }
	        function onRejected() {
	            pendingCount--;
	            if (pendingCount === 0) {
	                deferred.reject(new Error(
	                    "Can't get fulfillment value from any promise, all " +
	                    "promises were rejected."
	                ));
	            }
	        }
	        function onProgress(progress) {
	            deferred.notify({
	                index: index,
	                value: progress
	            });
	        }
	    }, undefined);
	
	    return deferred.promise;
	}
	
	Promise.prototype.any = function () {
	    return any(this);
	};
	
	/**
	 * Waits for all promises to be settled, either fulfilled or
	 * rejected.  This is distinct from `all` since that would stop
	 * waiting at the first rejection.  The promise returned by
	 * `allResolved` will never be rejected.
	 * @param promises a promise for an array (or an array) of promises
	 * (or values)
	 * @return a promise for an array of promises
	 */
	Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
	function allResolved(promises) {
	    return when(promises, function (promises) {
	        promises = array_map(promises, Q);
	        return when(all(array_map(promises, function (promise) {
	            return when(promise, noop, noop);
	        })), function () {
	            return promises;
	        });
	    });
	}
	
	Promise.prototype.allResolved = function () {
	    return allResolved(this);
	};
	
	/**
	 * @see Promise#allSettled
	 */
	Q.allSettled = allSettled;
	function allSettled(promises) {
	    return Q(promises).allSettled();
	}
	
	/**
	 * Turns an array of promises into a promise for an array of their states (as
	 * returned by `inspect`) when they have all settled.
	 * @param {Array[Any*]} values an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns {Array[State]} an array of states for the respective values.
	 */
	Promise.prototype.allSettled = function () {
	    return this.then(function (promises) {
	        return all(array_map(promises, function (promise) {
	            promise = Q(promise);
	            function regardless() {
	                return promise.inspect();
	            }
	            return promise.then(regardless, regardless);
	        }));
	    });
	};
	
	/**
	 * Captures the failure of a promise, giving an oportunity to recover
	 * with a callback.  If the given promise is fulfilled, the returned
	 * promise is fulfilled.
	 * @param {Any*} promise for something
	 * @param {Function} callback to fulfill the returned promise if the
	 * given promise is rejected
	 * @returns a promise for the return value of the callback
	 */
	Q.fail = // XXX legacy
	Q["catch"] = function (object, rejected) {
	    return Q(object).then(void 0, rejected);
	};
	
	Promise.prototype.fail = // XXX legacy
	Promise.prototype["catch"] = function (rejected) {
	    return this.then(void 0, rejected);
	};
	
	/**
	 * Attaches a listener that can respond to progress notifications from a
	 * promise's originating deferred. This listener receives the exact arguments
	 * passed to ``deferred.notify``.
	 * @param {Any*} promise for something
	 * @param {Function} callback to receive any progress notifications
	 * @returns the given promise, unchanged
	 */
	Q.progress = progress;
	function progress(object, progressed) {
	    return Q(object).then(void 0, void 0, progressed);
	}
	
	Promise.prototype.progress = function (progressed) {
	    return this.then(void 0, void 0, progressed);
	};
	
	/**
	 * Provides an opportunity to observe the settling of a promise,
	 * regardless of whether the promise is fulfilled or rejected.  Forwards
	 * the resolution to the returned promise when the callback is done.
	 * The callback can return a promise to defer completion.
	 * @param {Any*} promise
	 * @param {Function} callback to observe the resolution of the given
	 * promise, takes no arguments.
	 * @returns a promise for the resolution of the given promise when
	 * ``fin`` is done.
	 */
	Q.fin = // XXX legacy
	Q["finally"] = function (object, callback) {
	    return Q(object)["finally"](callback);
	};
	
	Promise.prototype.fin = // XXX legacy
	Promise.prototype["finally"] = function (callback) {
	    callback = Q(callback);
	    return this.then(function (value) {
	        return callback.fcall().then(function () {
	            return value;
	        });
	    }, function (reason) {
	        // TODO attempt to recycle the rejection with "this".
	        return callback.fcall().then(function () {
	            throw reason;
	        });
	    });
	};
	
	/**
	 * Terminates a chain of promises, forcing rejections to be
	 * thrown as exceptions.
	 * @param {Any*} promise at the end of a chain of promises
	 * @returns nothing
	 */
	Q.done = function (object, fulfilled, rejected, progress) {
	    return Q(object).done(fulfilled, rejected, progress);
	};
	
	Promise.prototype.done = function (fulfilled, rejected, progress) {
	    var onUnhandledError = function (error) {
	        // forward to a future turn so that ``when``
	        // does not catch it and turn it into a rejection.
	        Q.nextTick(function () {
	            makeStackTraceLong(error, promise);
	            if (Q.onerror) {
	                Q.onerror(error);
	            } else {
	                throw error;
	            }
	        });
	    };
	
	    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
	    var promise = fulfilled || rejected || progress ?
	        this.then(fulfilled, rejected, progress) :
	        this;
	
	    if (typeof process === "object" && process && process.domain) {
	        onUnhandledError = process.domain.bind(onUnhandledError);
	    }
	
	    promise.then(void 0, onUnhandledError);
	};
	
	/**
	 * Causes a promise to be rejected if it does not get fulfilled before
	 * some milliseconds time out.
	 * @param {Any*} promise
	 * @param {Number} milliseconds timeout
	 * @param {Any*} custom error message or Error object (optional)
	 * @returns a promise for the resolution of the given promise if it is
	 * fulfilled before the timeout, otherwise rejected.
	 */
	Q.timeout = function (object, ms, error) {
	    return Q(object).timeout(ms, error);
	};
	
	Promise.prototype.timeout = function (ms, error) {
	    var deferred = defer();
	    var timeoutId = setTimeout(function () {
	        if (!error || "string" === typeof error) {
	            error = new Error(error || "Timed out after " + ms + " ms");
	            error.code = "ETIMEDOUT";
	        }
	        deferred.reject(error);
	    }, ms);
	
	    this.then(function (value) {
	        clearTimeout(timeoutId);
	        deferred.resolve(value);
	    }, function (exception) {
	        clearTimeout(timeoutId);
	        deferred.reject(exception);
	    }, deferred.notify);
	
	    return deferred.promise;
	};
	
	/**
	 * Returns a promise for the given value (or promised value), some
	 * milliseconds after it resolved. Passes rejections immediately.
	 * @param {Any*} promise
	 * @param {Number} milliseconds
	 * @returns a promise for the resolution of the given promise after milliseconds
	 * time has elapsed since the resolution of the given promise.
	 * If the given promise rejects, that is passed immediately.
	 */
	Q.delay = function (object, timeout) {
	    if (timeout === void 0) {
	        timeout = object;
	        object = void 0;
	    }
	    return Q(object).delay(timeout);
	};
	
	Promise.prototype.delay = function (timeout) {
	    return this.then(function (value) {
	        var deferred = defer();
	        setTimeout(function () {
	            deferred.resolve(value);
	        }, timeout);
	        return deferred.promise;
	    });
	};
	
	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided as an array, and returns a promise.
	 *
	 *      Q.nfapply(FS.readFile, [__filename])
	 *      .then(function (content) {
	 *      })
	 *
	 */
	Q.nfapply = function (callback, args) {
	    return Q(callback).nfapply(args);
	};
	
	Promise.prototype.nfapply = function (args) {
	    var deferred = defer();
	    var nodeArgs = array_slice(args);
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided individually, and returns a promise.
	 * @example
	 * Q.nfcall(FS.readFile, __filename)
	 * .then(function (content) {
	 * })
	 *
	 */
	Q.nfcall = function (callback /*...args*/) {
	    var args = array_slice(arguments, 1);
	    return Q(callback).nfapply(args);
	};
	
	Promise.prototype.nfcall = function (/*...args*/) {
	    var nodeArgs = array_slice(arguments);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * Wraps a NodeJS continuation passing function and returns an equivalent
	 * version that returns a promise.
	 * @example
	 * Q.nfbind(FS.readFile, __filename)("utf-8")
	 * .then(console.log)
	 * .done()
	 */
	Q.nfbind =
	Q.denodeify = function (callback /*...args*/) {
	    var baseArgs = array_slice(arguments, 1);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        Q(callback).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};
	
	Promise.prototype.nfbind =
	Promise.prototype.denodeify = function (/*...args*/) {
	    var args = array_slice(arguments);
	    args.unshift(this);
	    return Q.denodeify.apply(void 0, args);
	};
	
	Q.nbind = function (callback, thisp /*...args*/) {
	    var baseArgs = array_slice(arguments, 2);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        function bound() {
	            return callback.apply(thisp, arguments);
	        }
	        Q(bound).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};
	
	Promise.prototype.nbind = function (/*thisp, ...args*/) {
	    var args = array_slice(arguments, 0);
	    args.unshift(this);
	    return Q.nbind.apply(void 0, args);
	};
	
	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback with a given array of arguments, plus a provided callback.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param {Array} args arguments to pass to the method; the callback
	 * will be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nmapply = // XXX As proposed by "Redsandro"
	Q.npost = function (object, name, args) {
	    return Q(object).npost(name, args);
	};
	
	Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
	Promise.prototype.npost = function (name, args) {
	    var nodeArgs = array_slice(args || []);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback, forwarding the given variadic arguments, plus a provided
	 * callback argument.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param ...args arguments to pass to the method; the callback will
	 * be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nsend = // XXX Based on Mark Miller's proposed "send"
	Q.nmcall = // XXX Based on "Redsandro's" proposal
	Q.ninvoke = function (object, name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 2);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};
	
	Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
	Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
	Promise.prototype.ninvoke = function (name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 1);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * If a function would like to support both Node continuation-passing-style and
	 * promise-returning-style, it can end its internal promise chain with
	 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
	 * elects to use a nodeback, the result will be sent there.  If they do not
	 * pass a nodeback, they will receive the result promise.
	 * @param object a result (or a promise for a result)
	 * @param {Function} nodeback a Node.js-style callback
	 * @returns either the promise or nothing
	 */
	Q.nodeify = nodeify;
	function nodeify(object, nodeback) {
	    return Q(object).nodeify(nodeback);
	}
	
	Promise.prototype.nodeify = function (nodeback) {
	    if (nodeback) {
	        this.then(function (value) {
	            Q.nextTick(function () {
	                nodeback(null, value);
	            });
	        }, function (error) {
	            Q.nextTick(function () {
	                nodeback(error);
	            });
	        });
	    } else {
	        return this;
	    }
	};
	
	Q.noConflict = function() {
	    throw new Error("Q.noConflict only works when Q is used as a global");
	};
	
	// All code before this point will be filtered from stack traces.
	var qEndingLine = captureLine();
	
	return Q;
	
	});
	
	/* WEBPACK VAR INJECTION */}.call());

/***/ },
]);

function CallOmniture(text) {
	var s = s_gi('wmg,wmggbglobal,wmgwmicharlixcx,wmggbcharlixcx');
	s.linkTrackVars = 'prop1,eVar4';
	s.prop1 = 'Charli XCX';
	s.eVar4 = 'Charli XCX';
	s.tl(this, 'o', text);
}