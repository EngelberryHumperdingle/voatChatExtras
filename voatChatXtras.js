// voatChatXtras.js
// https://voat.co/user/EngelbertHumperdinck

// console.log('voat chat extras 0.16.05 ');

// to do:
// add show all labels button
// optimize code, clean up redundant bits


/////////////////////////////////////////////////

// link style from github
$('head').append('<link rel="stylesheet" type="text/css" href="https://rawgit.com/EngelberryHumperdingle/voatChatExtras/master/voatChatXtras.css">');











//      *****     **          *****     ******       *****     **          *****
//    **     **   *         **     **   *     **   **     **   *         **     **
//    *       *   *         *       *   *      *   *       *   *         *       *
//    *           *         *       *   *     **   *       *   *         **
//    *           *         *       *   ******     *       *   *           *****
//    *    ****   *         *       *   *     **   *********   *                **
//    *       *   *         *       *   *      *   *       *   *                 *
//    *       *   *         *       *   *      *   *       *   *         *       *
//    **     **   *      *  **     **   *     **   *       *   *      *  **     **
//      *****     ********    *****     ******     *       *   ********    *****


var blockedUserList = [];
var blockedUserLinks = [];
var fresh = true;
var labelLists = {
  //'troll' : { labelName: 'troll', labelColor: 'rgb(120, 33, 169)', list: [] },
  //'bro' : { labelName: 'bro', labelColor: 'rgb(6, 115, 57)', list: [] }
};


















//    *********  *       *   *      *     *****    *********   ***     *****     *      *      *****
//    *          *       *   **     *   **     **      *        *    **     **   **     *    **     **
//    *          *       *   * *    *   *       *      *        *    *       *   * *    *    *
//    *          *       *   *  *   *   *              *        *    *       *   *  *   *    **
//    *******    *       *   *  *   *   *              *        *    *       *   *  *   *      *****
//    *          *       *   *   *  *   *              *        *    *       *   *   *  *           **
//    *          *       *   *   *  *   *              *        *    *       *   *   *  *            *
//    *          *       *   *    * *   *       *      *        *    *       *   *    * *    *       *
//    *          **     **   *     **   **     **      *        *    **     **   *     **    **     **
//    *            *****     *      *     *****        *       ***     *****     *      *      *****


function updateBlockList(){
  // show hidden block list if it's not empty
  if (blockedUserList.length > 0) {
    $('.blockListDisplay').css('display', 'inline');

    // keep block list in localStorage for later
    // this should not be done on a fresh page load...
    localStorage.setItem('blocked', blockedUserList.join(','));
  }
  else {
    // clear block list from localStorage
    localStorage.removeItem('blocked');
  }

  // clear the array
  blockedUserLinks = [];
  
  // add a link to blockedUserLinks for each name on the blockUserList
  $(blockedUserList).each(function(){
    blockedUserLinks.push('<a href="javascript:void(0)" class="unblockUser" data-user="'+this+'">'+this+'</a>');
  })

  // show all users
  $('div.chat-message').show();

  // hide all blocked users
  $(blockedUserList).each(function(i){
    var blockee = '/user/'+ this;
    $('a[href="'+blockee+'"]').parents('div.chat-message').hide();
  });

  // Show list of blocked users at the bottom of the screen
  $('.blockListDisplay').html('Click to unblock: '+ blockedUserLinks.join(', ') );
}


/////////////////////////////////////////////////


function updateLabels(){
  //console.log('\n updateLabels()');

  // if there are lists
  if (Object.keys(labelLists).length > 0){
    // look at each list
    for (var key in labelLists) {
      if (labelLists.hasOwnProperty(key)) {

        //console.log('looking at label: '+key);

        // hold all the css rules in here
        var theListCSS = [];
        var specialCSS = [];
        var specialIcon = "";
        var specialIconColor = "white";
        var bgColor = "rgba(0, 0, 0, 0)";

        // get special characters for certain labels
        switch (key) {
          case "bro" :
          case "goat" :
            // specialIcon = "🐐 &nbsp;";
            specialIcon = "♞";
            break;
          case "jew" :
          case "kike" : 
            specialIcon = "✡";
            break;
          case "commie" :
          case "communist" :
          case "socialist" :
            specialIcon = "☭";
            specialIconColor = "rgb(200, 0, 0)";
            break;
          case "shill" :
            specialIcon = "$";
            break;
          default :
            // no special icon
        }

        // if a label object has no users in it's list
        if (labelLists[key].list.length < 1) {
          
          //console.log('deleting empty list: '+key);

          // remove the label
          delete labelLists[key];

          // remove the corresponding style tag
          $('style#'+key).remove();
        }
        else {
          // make a css rule for each user on the list
          $(labelLists[key].list).each(function(){

            //console.log('adding css rule for: '+this);
            
            theListCSS.push( 'div.chat-message-head a[href="/user/'+this+'"]' );
            if (specialIcon != "") {
              specialCSS.push( 'div.chat-message-head a[href="/user/'+this+'"]::after' );
            }
          });

          // if there's no style element for this label
          if ( $('style#'+key).length < 1 ) {
            // make a new style element with an id of this label
            $('head').append( '<style id="'+key+'" type="text/css"></style>' );
          }

          // set bgColor if necessary
          // from -> http://codeitdown.com/jquery-color-contrast/
          var rgb = labelLists[key].labelColor.replace(/^(rgb|rgba)\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',');
          var yiq = ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000;
          //console.log('yiq# : '+yiq);
          var contrastingBackgroundCSS = "";
          if(yiq >= 85) { 
            //console.log('\t\t\t this looks good on the dark background'); 
          }
          else { 
            //console.log('\t\t\t this color needs a light background'); 
            // hard coded color value should be a variable
            contrastingBackgroundCSS = 'background-color: rgba(255,255,255,0.5); display: inline-block; padding: 0 2px; border-radius: 4px;';
          }

          // add the styles to the page
          $('style#'+key).html(theListCSS.join(',') + '{color: ' + labelLists[key].labelColor + '; ' + contrastingBackgroundCSS + (specialIcon == "" ? '}' : 'margin-right: 18px; position: relative; }') );

          if (specialIcon != "") {
            $('style#'+key).append(specialCSS.join(',') + '{content: "' + specialIcon + '"; color: '+specialIconColor+'; font-size: 1.5em; line-height: 0.8em; position: absolute; margin-left: 5px; top: 0px; }');
          }

        }
      }
      else {
        //console.log('key: '+key+' not found in labelLists');
      }

    }  
  }
  else {
    // console.log('no label lists')
  }
  
  // clear labelLists from localStorage
  if (fresh) {
    // we just got the lists from localStorage no need to write them back
    fresh = false;
  }
  else {
    // save the list in the browser for next visit
    updateLabelsInLocalStorage();
  }

  // store it in here so it doesn't call the function for every comment on the page
  var theListOfLabelLinks = labelListLinks();
  // update list links in .labels
  $('.labels').html( theListOfLabelLinks );

  var quickColor = randomRGBColor();
  // choose new random default color for color pickers
  $('.labelOptions .color').css('background-color', quickColor).val( quickColor );

  // clear the .userLabel input
  $('.labelOptions .userLabel').val('');
}

/////////////////////////////////////////////////

function logLabelLists() {
  console.log('\n logLabelLists()')
  
  if (Object.keys(labelLists).length > 0){
    for (var key in labelLists) {
      if (labelLists.hasOwnProperty(key)) {

        console.log('\t'+key+': '+JSON.stringify(labelLists[key]));
        try { $(labelLists[key].list).each(function(){
                console.log('\t\t'+this);
              });
        }
        catch(e){}
      }
    }  
  }
}

/////////////////////////////////////////////////

function updateLabelsInLocalStorage() {
  // console.log('\n updateLabelsInLocalStorage()');

  // console.log('labelLists: ', JSON.stringify(labelLists) );
  localStorage.setItem('labelLists', JSON.stringify(labelLists) );
}

/////////////////////////////////////////////////

function labelListLinks() {
  // returns a string containing a link for each label
  //console.log('\n labelListLinks()');

  var labelLinksHTML = [];

  // if there's any label lists
  if (Object.keys(labelLists).length > 0) {
    // check each label list
    for (var key in labelLists) {
      if (labelLists.hasOwnProperty(key)) {

        // set bgColor if necessary
        // from -> http://codeitdown.com/jquery-color-contrast/
        // reduntant code from updateLabels()...
        var rgb = labelLists[key].labelColor.replace(/^(rgb|rgba)\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',');
        var yiq = ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000;
        // console.log('yiq# : '+yiq);
        var contrastingBackgroundCSS = "";
        if(yiq >= 85) { 
          // console.log('\t\t\t this looks good on the dark background'); 
        }
        else { 
          //bgColor = "rgba(255, 255, 255, 1)"; 
          // console.log('\t\t\t this color needs a light background'); 
          contrastingBackgroundCSS = 'background-color: rgba(255,255,255,0.5); display: inline-block; padding: 0 2px; border-radius: 4px;';
        }

        // make a link for each created list
        labelLinksHTML.push('<a href="javascript:void(0)" class="'+key+'" style="color: '+labelLists[key].labelColor+'; ' + contrastingBackgroundCSS + '">'+key+'</a>');
      }
    }  
    return labelLinksHTML.join(' | ');
  }
  else {
    // console.log('no label lists');
    return "";
  }
}


function randomRGBColor(){
  var col = 'rgb(' + (Math.floor(Math.random() * 256)) + ', ' + (Math.floor(Math.random() * 256)) + ', ' + (Math.floor(Math.random() * 256)) + ')';
  return col;
}



















//      *****     **        ***     *****     *     *    *****
//    **     **   *          *    **     **   *    *   **     **
//    *       *   *          *    *           *   *    *       *
//    *           *          *    *           *  *     **
//    *           *          *    *           * *        *****
//    *           *          *    *           ***             **
//    *           *          *    *           *  *             *
//    *       *   *          *    *       *   *   *    *       *
//    **     **   *      *   *    **     **   *    *   **     **
//      *****     ********  ***     *****     *     *    *****


////////////////////////////////
// click block buttons
$('body').on('click', 'button.blockUser', function(){
  var theUser = $(this).parent('p').find('a').attr('href').split('/').pop();
  blockedUserList.push( theUser );
  
  updateBlockList();
    
});


////////////////////////////////
// click unblock buttons
$('body').on('click', '.unblockUser', function(e){
  e.preventDefault();

  // remove from list array
  blockedUserList.splice(blockedUserList.indexOf($(this).attr('data-user')), 1);
  // remove from links array
  blockedUserLinks.splice(blockedUserLinks.indexOf(this), 1);
  
  updateBlockList();

  // if there are no users on the block list, hide it
  if (blockedUserList.length <= 0) $('.blockListDisplay').css('display', 'none');
});


////////////////////////////////
// click label button
$('body').on('click', 'button.labelUser', function(){

  // show/hide the label options
  $(this).siblings('.labelOptions').toggle(200);
});


////////////////////////////////
// click actual labels
$('body').on('click', '.labelOptions a', function(){
  // hide the label options
  $(this).parents('.labelOptions').hide(200);

  var theUser = $(this).parents('p').find('a').attr('href').split('/').pop();
  var userColor = $(this).parents('p').find('a').css('color');
  var labelColor = $(this).css('color');
  var theLabel = $(this).text();

  // console.log('----------------------\n----------------------\nyou clicked: '+theLabel);

  // if the user is already on the selected list
  if (userColor == labelColor) {
    // this should be done another way in case two labels use the same color
    // or prevent users from creating two lists with the same color...

    // remove user from selected list 
    // console.log('removing: '+theUser+' from list: '+theLabel);    
    labelLists[theLabel].list.splice(labelLists[theLabel].list.indexOf(theUser), 1);

    // if the selected list is empty
    if (labelLists[theLabel].list.length < 1) {

      // remove it from the labelLists
      // console.log('deleting empty list: '+theLabel);
      delete labelLists[theLabel];

      // remove the corresponding style tag
      $('style#'+theLabel).remove();

      // remove the list from localStorage
      updateLabelsInLocalStorage();
    }
  }
  else {
    // remove user from the other lists if present
    for (var key in labelLists) {
      
      // make sure it's not the list you just clicked
      if (key != theLabel) {

        // if the user is on the list
        if ( labelLists[key].list.indexOf(theUser) != -1) {
          // console.log('removing: '+theUser+' from list: '+theLabel);
          labelLists[key].list.splice(labelLists[key].list.indexOf(theUser), 1);
        }

      }
      
    }

    // add it to the new list
    // theList.list.push(theUser);
    // console.log('adding: '+theUser+' to list: '+theLabel)
    labelLists[theLabel].list.push(theUser);
  }
  
  updateLabels();

});


////////////////////////////////
// click the add label button
$('body').on('click', '.addLabel', function(){
  $(this).parents('.labelOptions').hide(200);

  // get label from input
  // remove anything but numbers, letters, and spaces.  make all letters lowercase.  replace all spaces with dashes.
  var newList = $(this).parent('.labelOptions').find('.userLabel').val().replace(/[^\w\s]/gi, '').toLowerCase().replace(' ','-');
  // get color from input
  var newColor = $(this).parent('.labelOptions').find('.color').val();
  // get user
  var theUser = $(this).parents('p').find('a').attr('href').split('/').pop();
  
  var nameUnique = true;

  // don't allow new labels without a name
  if ( newList == "" ) {
    alert('please enter a label for: '+theUser);
  }
  else {
    // check for duplicate list
    if (Object.keys(labelLists).length > 0){
      for (var key in labelLists) {
        if (labelLists.hasOwnProperty(key)) {
          if (newList == key) {
            alert('you already have a label called \''+newList+'\'');
            nameUnique = false;
          } 
        }
      }  
    }


    if (nameUnique) {
      // look at each label list
      for (var label in labelLists) {
        if (labelLists.hasOwnProperty(label)) {
          
          // look at each user on the list
          for (var user in labelLists[label].list) {
            // console.log('user: '+labelLists[label].list[user]+', theUser: '+theUser);
            // if the user exists on the list
            if (labelLists[label].list[user] == theUser) {

              // remove the user from the list
              // console.log('removing: '+theUser+' from list: '+label);
              labelLists[label].list.splice(labelLists[label].list.indexOf(theUser), 1);

              // somewhat redundant code from 'click actual labels'
              // maybe pull this into a function...

              // if the selected list is empty
              if (labelLists[key].list.length < 1) {

                // remove it from the labelLists
                // console.log('deleting empty list: '+key);
                delete labelLists[key];

                // remove the corresponding style tag
                $('style#'+key).remove();

                // remove the list from localStorage
                updateLabelsInLocalStorage();
              }

            }
          }              
        }
      }

      // create new label list containing user
      //console.log('new list: '+ newList +', color: '+ newColor);
      var labelListObject = {};
      labelListObject.labelName = newList;
      labelListObject.labelColor = newColor;
      labelListObject.list = [theUser];
      labelLists[newList] = labelListObject;

      updateLabels();

      // store it in here so it doesn't call the function for every comment on the page
      var theListOfLabelLinks = labelListLinks();
      // update list links in .labels
      $('.labels').html( theListOfLabelLinks );
    }

    // console
    // logLabelLists();
  }

});

// pressing enter while focussed on .userLabel or .color inputs clicks the addLabel button
$('body').on('keydown','.labelOptions .userLabel, .labelOptions .color, .cp-color-picker', function(event) {
  if (event.keyCode == 13) {
    $('.cp-color-picker').hide();
    $(this).siblings('.addLabel').click();
  }
});















//    *******     ********     *****     *******    *         *
//    *      **   *          **     **   *      **   *       *
//    *       *   *          *       *   *       *    *     *
//    *       *   *          *       *   *       *     *   *
//    *      **   *          *       *   *       *       *
//    *******     ******     *********   *       *       *
//    *      *    *          *       *   *       *       *
//    *       *   *          *       *   *       *       *
//    *       *   *          *       *   *      **       *
//    *       *   ********   *       *   *******         *




$(function(){

  // get random color for color picker
  var initialColor = randomRGBColor();
  
  // code for buttons
  var blockButton = '&nbsp; <button type="button" class="blockUser">block</button>';
  var labelButton = '&nbsp; <button type="button" class="labelUser">label</button> <span class="labelOptions"> &nbsp; <span class="labels"></span> &nbsp; <input class="userLabel" type="text" name="userLabel" placeholder="new label" /> &nbsp; <input class="color" background-color="'+ initialColor +'" value="'+ initialColor +'" /> &nbsp; <button type="button" class="addLabel">add</button> </span>';
  var blockListDisplay = '<div class="blockListDisplay" >Click to unblock: </div>';
  var labelListDisplay = '<div class="labelListDisplay" >Click label to delete: </div>';
  var numComments = $('.chat-message').length;
  
  // add area to display blocked users
  $('.sidecontentbox').append(blockListDisplay);

  // add buttons to existing comments
  $('.chat-message-head p').append(blockButton).append(labelButton);
  
  // activate color picker
  $.getScript( "https://rawgit.com/PitPik/tinyColorPicker/master/jqColorPicker.min.js" )
    .done(function( script, textStatus ) {
      $('.color').colorPicker({
        opacity: false,
        color: initialColor
      });
    })
    .fail(function( jqxhr, settings, exception ) {
      alert('couldn\'t load colorpicker script. \n You could probably still type in the rgb values if you want.');
  });

  // get blocked list from localStorage
  if (localStorage.getItem('blocked') != null) {
    blockedUserList = localStorage.getItem('blocked').split(',');
    updateBlockList();
  }

  // get labels from localStorage
  if (localStorage.getItem('labelLists') != null) {
    // get label lists from localStorage
    labelLists = JSON.parse(localStorage.getItem('labelLists'));
    //console.log('labelLists JSON: '+JSON.stringify(labelLists));

    updateLabels();

    // logLabelLists();
  }
  else {
    // console.log('NO user lists in localStorage');
  }

  //////////////////////////////////////////////////////// 
  // update display each time a new comment is added
  $('.chatContent').bind("DOMSubtreeModified",function(){

    // add buttons to newly added comment
    if ($('.chat-message').length > numComments) {
      numComments = $('.chat-message').length;

      // add block and label buttons
      $('.chat-message:last').find('.chat-message-head p').append(blockButton).append(labelButton);

      // activate color picker
      var quickColor = randomRGBColor();
      $('.chat-message:last').find('.color').colorPicker({
        opacity: false,
        color: quickColor
      });

      // store it in here so it doesn't call the function for every comment on the page
      var theListOfLabelLinks = labelListLinks();
      
      // update list links in .labels
      $('.chat-message:last').find('.labels').html( theListOfLabelLinks );

      updateBlockList();
    } 
  
    // change the word 'fist' to 'chef'
    $('.chat-message-body p').each(function(){
      if ($(this).text().match(/FIST/g)) $(this).html($(this).html().replace(/FIST/g, 'CHEF'));
      if ($(this).text().match(/fist/g)) $(this).html($(this).html().replace(/fist/g, 'chef'));
      if ($(this).text().match(/Fist/g)) $(this).html($(this).html().replace(/Fist/g, 'Chef'));
    });

  });
  
});