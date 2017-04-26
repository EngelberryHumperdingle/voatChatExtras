// voatChatXtras.js
// https://voat.co/user/EngelbertHumperdinck

console.log('custom lists 0.15.13 ');

// to do:
// √ don't allow users on more than one list
// √ when adding user to new list, make sure to remove from all other lists
// add contrasting background color to dark usernames
// position icons outside user name background color
// not clicking on color option before adding label chooses incorrect color
// investigate redundant code in updateLabelsX()


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
var labelListsX = {
  //'troll' : { labelName: 'troll', labelColor: 'rgb(120, 33, 169)', list: [] },
  //'bro' : { labelName: 'bro', labelColor: 'rgb(6, 115, 57)', list: [] }
};


















//    *********   *       *   *      *     *****    *********   ***     *****     *      *      *****
//    *           *       *   **     *   **     **      *        *    **     **   **     *    **     **
//    *           *       *   * *    *   *       *      *        *    *       *   * *    *    *
//    *           *       *   *  *   *   *              *        *    *       *   *  *   *    **
//    *******     *       *   *  *   *   *              *        *    *       *   *  *   *      *****
//    *           *       *   *   *  *   *              *        *    *       *   *   *  *           **
//    *           *       *   *   *  *   *              *        *    *       *   *   *  *            *
//    *           *       *   *    * *   *       *      *        *    *       *   *    * *    *       *
//    *           **     **   *     **   **     **      *        *    **     **   *     **    **     **
//    *             *****     *      *     *****        *       ***     *****     *      *      *****


function updateBlockList(){
  // show hidden block list if it's not empty
  if (blockedUserList.length > 0) {
    $('.blockListDisplay').css('display', 'inline');

    // keep block list in localStorage for later
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


function updateLabelsX(){
  console.log('\n updateLabelsX()');

  // if there are lists
  if (Object.keys(labelListsX).length > 0){
    // look at each list
    for (var key in labelListsX) {
      if (labelListsX.hasOwnProperty(key)) {

        //console.log('looking at label: '+key);

        // hold all the css rules in here
        var theListCSS = [];
        var specialCSS = [];
        var specialIcon = "";
        var specialIconColor = 'white';

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
            specialIconColor = "rgb(169, 0, 0)";
            break;
          case "shill" :
            specialIcon = "$";
            break;
          default :
            // no special icon
        }

        // if a label object has no users in it's list
        if (labelListsX[key].list.length < 1) {
          // this should never happen
          // it has already been checked in the click function
          
          console.log('deleting empty list: '+key);

          // remove the label
          delete labelListsX[key];

          // remove the corresponding style tag
          $('style#'+key).remove();
        }
        else {
          // make a css rule for each user on the list
          $(labelListsX[key].list).each(function(){

            console.log('adding css rule for: '+this);
            
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

          // add the styles to the page
          $('style#'+key).html(theListCSS.join(',') + '{color: '+labelListsX[key].labelColor+'; background-color: rgba(255,255,255,0.3); margin-right: 20px; '+ (specialIcon == "" ? '}' : 'margin-right: 18px; position: relative; }') ;

          if (specialIcon != "") {
            $('style#'+key).append(specialCSS.join(',') + '{content: "' + specialIcon + '"; color: '+specialIconColor+'; font-size: 1.5em; line-height: 0.8em; position: absolute; margin-left: 5px; top: 0px; }');
          }

        }
      }
      else {
        console.log('key: '+key+' not found in labelListsX');
      }

    }  
  }
  else {
    console.log('no label lists')
  }
  
  // clear labelListsX from localStorage
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
}

/////////////////////////////////////////////////

function logLabelLists() {
  console.log('\n logLabelLists()')
  
  if (Object.keys(labelListsX).length > 0){
    for (var key in labelListsX) {
      if (labelListsX.hasOwnProperty(key)) {

        console.log('\t'+key+': '+JSON.stringify(labelListsX[key]));
        try { $(labelListsX[key].list).each(function(){
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
  console.log('\n updateLabelsInLocalStorage()');

  console.log('labelListsX: ', JSON.stringify(labelListsX) );
  localStorage.setItem('labelListsX', JSON.stringify(labelListsX) );
}

/////////////////////////////////////////////////

function labelListLinks() {
  // returns a string containing a link for each label
  console.log('\n labelListLinks');

  //$('.labelOptions .userLabel').val('');

  var labelLinksHTML = [];

  // if there's any label lists
  if (Object.keys(labelListsX).length > 0) {
    // check each label list
    for (var key in labelListsX) {
      if (labelListsX.hasOwnProperty(key)) {
        // make a link for each created list
        labelLinksHTML.push('<a href="javascript:void(0)" class="'+key+'" style="color: '+labelListsX[key].labelColor+';">'+key+'</a>');
      }
    }  
    return labelLinksHTML.join(' | ');
  }
  else {
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

  console.log('----------------------\n----------------------\nyou clicked: '+theLabel);

  // if the user is already on the selected list
  if (userColor == labelColor) {

    // remove user from selected list 
    console.log('removing: '+theUser+' from list: '+theLabel);    
    labelListsX[theLabel].list.splice(labelListsX[theLabel].list.indexOf(theUser), 1);

    // if the selected list is empty
    if (labelListsX[theLabel].list.length < 1) {

      // remove it from the labelListsX
      console.log('deleting empty list: '+theLabel);
      delete labelListsX[theLabel];

      // remove the corresponding style tag
      $('style#'+theLabel).remove();

      // remove the list from localStorage
      updateLabelsInLocalStorage();
    }
  }
  else {
    // remove user from the other lists if present
    for (var key in labelListsX) {
      
      // make sure it's not the list you just clicked
      if (key != theLabel) {

        // if the user is on the list
        if ( labelListsX[key].list.indexOf(theUser) != -1) {
          console.log('removing: '+theUser+' from list: '+theLabel);
          labelListsX[key].list.splice(labelListsX[key].list.indexOf(theUser), 1);
        }

      }
      
    }

    // add it to the new list
    // theList.list.push(theUser);
    console.log('adding: '+theUser+' to list: '+theLabel)
    labelListsX[theLabel].list.push(theUser);
  }
  
  updateLabelsX();

});


////////////////////////////////
// click the add label button
$('body').on('click', '.addLabel', function(){
  $(this).parents('.labelOptions').hide(200);

  // get list name and color from inputs
  var newList = $(this).parent('.labelOptions').find('.userLabel').val().toLowerCase();
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
    if (Object.keys(labelListsX).length > 0){
      for (var key in labelListsX) {
        if (labelListsX.hasOwnProperty(key)) {
          if (newList == key) {
            alert('you already have a label called \''+newList+'\'');
            nameUnique = false;
          } 
        }
      }  
    }


    if (nameUnique) {
      // look at each label list
      for (var label in labelListsX) {
        if (labelListsX.hasOwnProperty(label)) {
          
          // look at each user on the list
          for (var user in labelListsX[label].list) {
            console.log('user: '+labelListsX[label].list[user]+', theUser: '+theUser);
            // if the user exists on the list
            if (labelListsX[label].list[user] == theUser) {

              // remove the user from the list
              console.log('removing: '+theUser+' from list: '+label);
              labelListsX[label].list.splice(labelListsX[label].list.indexOf(theUser), 1);

              // somewhat redundant code from 'click actual labels'
              // maybe pull this into a function...

              // if the selected list is empty
              if (labelListsX[key].list.length < 1) {

                // remove it from the labelListsX
                console.log('deleting empty list: '+key);
                delete labelListsX[key];

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
      console.log('new list: '+ newList +', color: '+ newColor);
      var labelListObject = {};
      labelListObject.labelName = newList;
      labelListObject.labelColor = newColor;
      labelListObject.list = [theUser];
      labelListsX[newList] = labelListObject;

      updateLabelsX();

      // store it in here so it doesn't call the function for every comment on the page
      var theListOfLabelLinks = labelListLinks();
      // update list links in .labels
      $('.labels').html( theListOfLabelLinks );
    }

    // console
    logLabelLists();
  }

});



















//    *******     ********     *****     *******    *         *
//    *      **   *          **     **   *      **   *       *
//    *       *   *          *       *   *       *    *     *
//    *       *   *          *       *   *       *     *   *
//    *      **   *          *       *   *       *       *
//    *******     ******     *****   *   *       *       *
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
  if (localStorage.getItem('labelListsX') != null) {
    // get label lists from localStorage
    labelListsX = JSON.parse(localStorage.getItem('labelListsX'));
    console.log('labelListsX JSON: '+JSON.stringify(labelListsX));

    updateLabelsX();

    logLabelLists();
  }
  else {
    console.log('NO user lists in localStorage');
  }

  //////////////////////////////////////////////////////// 
  // update display each time a new comment is added
  $('.chatContent').bind("DOMSubtreeModified",function(){

    // add buttons to newly added comment
    if ($('.chat-message').length > numComments) {
      numComments = $('.chat-message').length;
      $('.chat-message:last').find('.chat-message-head p').append(blockButton).append(labelButton);
      

      // store it in here so it doesn't call the function for every comment on the page
      var theListOfLabelLinks = labelListLinks();
      // update list links in .labels
      $('.labels').html( theListOfLabelLinks );

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