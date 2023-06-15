$(document).ready(function () {
	// Variables
	var hasAdjustedTime = false;

    $('.summoner-profile-info')
	
    /*
	// Upon loading the page, hide everything except for the buttons and the most played champions
	$('#summoner-profile-container').children().slice(5).css('display', 'none');

	// When the Champion Mastery Button is clicked, hide details from match history and live game data
	$('#profile_champion_mastery').on('click', function(){
		$('#champion-profile-container').children().eq(3).css('display', 'block');
		$('#champion-profile-container').children().eq(4).css('display', 'none');
	});
	
	// When the Match History button is clicked, hide details from champion mastery and live game data
	$('#profile_match_history').on('click', function(){
		$('#champion-profile-container').children().eq(3).css('display', 'none');
		$('#champion-profile-container').children().eq(4).css('display', 'block');

		// If the player won, change the background of the match history detail to be blue.
		// Otherwise, change the background of the match history detail to be red.
		$('.match-history-detail').each(function(i){
			$(this).css('border-style', 'solid');
			if($(this).children().eq(0).hasClass('Winner')){
				$(this).css('background-color', '#006db0');
			}
			else{
				$(this).css('background-color', '#9d2933');
			}
		})

		// In addition, change the long integer to a local timestamp
		// Solution: the long integer was sent as a string; typecast to Number.  However, only do this once
		if(!hasAdjustedTime){
			$('.gameCreation').each(function(){
				$(this).text(new Date(Number($(this).text())).toLocaleString());
				hasAdjustedTime = true;
			});
		}


	});

	// When any of the images from the match history are hovered, show the name of the champion as a tooltip.
	$('.champion-history-icon').each(function(i){
		$(this).on('mouseenter', function(){
            $('.tooltip, p.champion-history-hover-text').children().eq(i).css('visibility', 'visible');
		})

		$(this).on('mouseleave', function(){
            $('.tooltip, p.champion-history-hover-text').children().eq(i).css('visibility', 'hidden');
		})

		// When clicking on the icon, collapse the expanded match history details
		$(this).on('click', function(){
			console.log('Time to close the match history for this match!');
		})
	});

	// When any of the new users are clicked within the match history, forcibly stop propagation
	$('.navigate-to-different-user').each(function(e){
		//e.stopPropagation();
	});

	// When any of the match history details are clicked, expand it to show all participating players and their ending items.
	$('.match-history-detail').each(function(i){
		$(this).on('click', function(){
			console.log('69 is a nice number :)');
			if($(this).children().eq(0).children().eq(4).css('display') == 'block'){
				$(this).children().eq(0).children().eq(4).css('display', 'none');
			}
			else{
				$(this).children().eq(0).children().eq(4).css('display', 'block');
			}
		});
	});

    */
});

