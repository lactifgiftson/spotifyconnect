<!DOCTYPE html>
<html lang="en">
	<head>
		<meta name="twitter:site" content="@thewildfeathers">
		<meta name="twitter:description" content='Enter for your chance to win a trip to fly to Nashville, Tennessee to see The Wild Feathers perform at the Ryman Auditorium!'>
		<meta name="twitter:text:title" content="The Wild Feathers | Nashville Flyaway Sweepstakes">
		<meta name="twitter:image" content="">
		<meta charset="utf-8" />
		<title>The Wild Feathers | Nashville Flyaway Sweepstakes</title>
		<link type="text/css" rel="stylesheet" href="fonts/fonts.css" media="all" />
		<link type="text/css" rel="stylesheet" href="styles.css" media="all" />
		<link rel="shortcut icon" href="images/favicon.ico" type="image/vnd.microsoft.icon" />
		<link rel="canonical" href="" />
		<meta name="viewport" content="initial-scale=1.0, width=device-width, maximum-scale=1.0" />
		<meta name="keywords" content="Enter for your chance to win a trip to fly to Nashville, Tennessee to see The Wild Feathers perform at the Ryman Auditorium!" />
		<meta name="description" content="Enter for your chance to win a trip to fly to Nashville, Tennessee to see The Wild Feathers perform at the Ryman Auditorium!" />
		<meta property="og:url" content="" />
		<meta property="og:type" content="website" />
		<meta property="og:image" content="" />
		<meta property="og:title" content="The Wild Feathers | Nashville Flyaway Sweepstakes"/>
		<meta property="og:description" content="Enter for your chance to win a trip to fly to Nashville, Tennessee to see The Wild Feathers perform at the Ryman Auditorium!" />
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" type="text/javascript"></script>
		<script src="js/scripts.js" type="text/javascript"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="https://use.typekit.net/uwp2utl.css">
		<script src="js/shared.js"></script>
		<script src="js/app.js"></script>
	</head>
	<body id="twf-sp">

		<div class="site-container">
			<div class="logo">
				<img src="images/dk-logo.png">
			</div>
			<div class="neon-box">
				<div class="line-1">
					Enter for your chance to win
				</div>
				<div class="line-2">
					a trip to see The Wild Feathers perform
					<br>
					at the historic Ryman Auditorium in Nashville, Tennessee!
				</div>
				<div class="neonLines">
					<img src="images/dk-glow.png" class="neonBar">
				</div>
			</div>
			<div class="contest-info">
				<div class="ci-line-1">
					One winner will receive:
				</div>
				<div class="ci-line-2">
					Roundtrip airfare to Nashville, Tennessee provided by Southwest Airlines
				</div>
				<div class="ci-line-2">
					Two-night hotel stay
				</div>
				<div class="ci-line-3">
					Two tickets to see The Wild Feathers at the Ryman Auditorium
				</div>
			</div>
			<div class="follow">
				<a  href="javascript:void(0)" class="spotify-btn" id="follow-artist-1"><img src="images/dk-follow.png"></a>
			</div>
			<div id="spotify-app"></div>
			<div class="alter">
				or <a class="bypass" href="javascript:void(0)">click here to enter without using spotify</a>
				<div class="here-link">
					By entering you agree to the <a href="">Official Rules</a>.
				</div>
			</div>
			<div class="footer">
				<div class="southwest">
					<img src="images/dk-southwest.png">
				</div>
				<div class="enter-site">
					<a href="fonts/?frontpage=true" data-track="enter-site">ENTER THEWILDFEATHERS.COM&nbsp;&nbsp;<span><img src="images/arrowImage.png"></span></a>
				</div>
				<div class="socials">
					<span class="filler">Follow Us</span>
					<a data-track="facebook-ftr" class="icon-facebook" href="http://facebook.com/thewildfeathers" target="_blank"></a>
					<a data-track="twitter-ftr" class="icon-twitter" href="http://twitter.com/thewildfeathers" target="_blank"></a>
					<a data-track="instagram-ftr" class="icon-instagram" href="http://instagram.com/thewildfeathers" target="_blank"></a>
					<a data-track="youtube-ftr" class="icon-youtube" href="http://youtube.com/thewildfeathers" target="_blank"></a>
					<a data-track="spotify-ftr" class="icon-spotify"  class="icon-facebook" href="https://open.spotify.com/artist/5YENCIQVzziCFdoVWc26Bn" target="_blank"></a>
					<a data-track="apple-ftr" class="icon-appleinc" href="https://wmna.sh/twf_gftnf_am" target="_blank"></a>
					<a -track="amazon-ftr" class="icon-amazon" href="https://wmna.sh/twf_grtnf_az" target="_blank"></a>
				</div>
				<div class="footer-text">
					&copy; 2018 WARNER MUSIC NASHVILLE. ALL RIGHTS RESERVED. <a class="footer-privacy-policy" target="_blank" href="http://www.warnerbrosrecords.com/privacy-policy/">Privacy&nbsp;Policy</a><span class="footer-sep">|</span><a target="_blank" class="footer-terms-of-service" href="http://www.warnerbrosrecords.com/terms-of-service">Terms&nbsp;Of&nbsp;Use</a><span class="footer-sep">|</span><a target="_blank" href="http://www.warnerbrosrecords.com/privacy-policy#adchoices">Ad&nbsp;Choices</a><span class="footer-sep">|</span><a target="_blank" href="https://wminewmedia.com/cookies">Cookie&nbsp;Policy</a>
				</div>
			</div>
		</div>
		<div class="overlay">
			<script>
			var userEmail = "";
				(function() {

					var stateKey = 'spotify_auth_state';

					/**
					 * Obtains parameters from the hash of the URL
					 * @return Object
					 */
					function getHashParams() {
						var hashParams = {};
						var e,
						    r = /([^&;=]+)=?([^&;]*)/g,
						    q = window.location.hash.substring(1);
						while ( e = r.exec(q)) {
							hashParams[e[1]] = decodeURIComponent(e[2]);
						}
						return hashParams;
					}

					/**
					 * Generates a random string containing numbers and letters
					 * @param  {number} length The length of the string
					 * @return {string} The generated string
					 */
					function generateRandomString(length) {
						var text = '';
						var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

						for (var i = 0; i < length; i++) {
							text += possible.charAt(Math.floor(Math.random() * possible.length));
						}
						return text;
					};
					oauthPlaceholder = document.getElementById('oauth');

					var params = getHashParams();

					var access_token = params.access_token,
					    state = params.state,
					    storedState = localStorage.getItem(stateKey);

					if (access_token && (state == null || state !== storedState)) {
						alert('There was an error during the authentication');
					} else {
						localStorage.removeItem(stateKey);
						if (access_token) {
							$.ajax({
								url : 'https://api.spotify.com/v1/me',
								headers : {
									'Authorization' : 'Bearer ' + access_token
								},
								success : function(response) {
									userEmail = response.email;
									alert("follow");
									$.ajax({
										url : 'https://api.spotify.com/v1/me/following?type=artist&ids=5YENCIQVzziCFdoVWc26Bn',
										type : 'PUT',
										async : false,
										headers : {
											'Authorization' : 'Bearer ' + access_token,
											'Content-Type' : 'application/json'
										},
										success : function(r) {
											console.log(r);
											registerForEmail(userEmail, "test");
										}
									});

									$('#login').hide();
									$('#loggedin').show();
									console.log("After login");

								}
							});
						} else {
							$('#login').show();
							$('#loggedin').hide();
						}

						document.getElementById('follow-artist-1').addEventListener('click', function() {

							var client_id = 'a9a96517a88f4386ad1b971b326d137c';
							// Your client id
							var redirect_uri = 'http://apps.coleswindell.com/twf/';
							// Your redirect uri

							var state = generateRandomString(16);

							localStorage.setItem(stateKey, state);
							var scope = 'user-read-private user-read-email user-follow-modify';

							var url = 'https://accounts.spotify.com/authorize';
							url += '?response_type=token';
							url += '&client_id=' + encodeURIComponent(client_id);
							url += '&scope=' + encodeURIComponent(scope);
							url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
							url += '&state=' + encodeURIComponent(state);

							window.location = url;
						}, false);
					}
				})();
			</script>
		</div>
		<div class="mlist-section">
			<?php
			include "mlist.php";
			?>
		</div>
	</body>
</html>