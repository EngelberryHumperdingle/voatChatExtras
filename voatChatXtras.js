// voatChatXtras.js
// https://voat.co/user/EngelbertHumperdinck

/////////////////////////////////////////////////

var blockedUserList = [];
var fakeList = { labelName: 'fake', labelColor: 'rgb(255, 0, 0)', list: [] };
var shillList = { labelName: 'shill', labelColor: 'rgb(7, 82, 165)', list: [] };
var broList = { labelName: 'bro', labelColor: 'rgb(6, 115, 57)', list: [] };
var labelLists = [fakeList, shillList, broList];
var blockedUserLinks = [];
var fresh = true;

/////////////////////////////////////////////////

function updateBlockList(){
  if (blockedUserList.length > 0) {
    $('.blockListDisplay').css('display', 'inline');
    localStorage.setItem('blocked', blockedUserList.join(','));
  }

  blockedUserLinks = [];
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


// ✡ Unicode: U+2721, UTF-8: E2 9C A1
// 🐐 Unicode: U+1F410 (U+D83D U+DC10), UTF-8: F0 9F 90 90

  

function updateLabels(){

  $(labelLists).each(function(){
    
    // write a new css rule for each user on the list
    var theListHTML = [];
    

    // clear empty lists from localStorage
    if (this.list.length < 1) {
      localStorage.clear(this.labelName)
      $('style#'+this.labelName).html("");
    }        
    else {
      // make a css rule for each user on ths list
      $(this.list).each(function(){
          theListHTML.push( 'div.chat-message-head a[href="/user/'+this+'"]' ); 
      });

      // add the styles to the page
      $('style#'+this.labelName).html(theListHTML + '{color: '+this.labelColor+'}');
    }

    if (fresh) {
      // we just got the lists from localStorage no need to write them back
      fresh = false;
    }
    else {
      // save the list in the browser for next visit
      localStorage.setItem(this.labelName, this.list.join(','));
    }
      


  });

}

/////////////////////////////////////////////////

// click block buttons
$('body').on('click', 'button.blockUser', function(){
  var theUser = $(this).parent('p').find('a').attr('href');
  var userName = theUser.split('/').pop();
  blockedUserList.push( userName );
  
  updateBlockList();
    
});

// click unblock buttons
$('body').on('click', '.unblockUser', function(e){
  e.preventDefault();

  // remove from list array
  blockedUserList.splice(blockedUserList.indexOf($(this).attr('data-user')), 1);
  // remove from links array
  blockedUserLinks.splice(blockedUserLinks.indexOf(this), 1);
  
  updateBlockList();

  if (blockedUserList.length <= 0) $('.blockListDisplay').css('display', 'none');
});

// click label button
$('body').on('click', 'button.labelUser', function(){
  $(this).siblings('.labelOptions').toggle(200);
});

// click actual labels
$('body').on('click', '.labelOptions a', function(){
  $(this).parent('.labelOptions').hide(200);

  var theUser = $(this).parents('p').find('a').attr('href');
  var userName = theUser.split('/').pop();
  var theList = {};
  var theOtherLists = [];
  var theLabel = $(this).text();
  var userColor = $(this).parents('p').find('a').css('color');
  var labelColor = "";

  switch ( theLabel ) {
    case 'fake' : 
      theList = fakeList;
      theOtherLists = [shillList, broList];
      labelColor = "rgb(255, 0, 0)";
      break;
    case 'shill' : 
      theList = shillList;
      theOtherLists = [fakeList, broList];
      labelColor = "rgb(7, 82, 165)";
      break;
    case 'bro' : 
      theList = broList;
      theOtherLists = [fakeList, shillList];
      labelColor = "rgb(6, 115, 57)";
      break;
    default :
      // this will never happen
      
      // default voat color
      labelColor = "rgb(86, 168, 218)";
  }

  // if the user is already on the selected list
  if (userColor == labelColor) {
    // remove user from selected list
    theList.list.splice(theList.list.indexOf(userName), 1);

    // if the selected list is empty, remove it from localStorage
    if (theList.list.length < 1) localStorage.clear(theLabel);
  }
  else {
    // remove user from the other lists if present
    $(theOtherLists).each(function(i){
      // if the user is on the list
      if ( this.list.indexOf(userName) != -1 ) {
        this.list.splice(this.list.indexOf(userName), 1);
      }
    });

    // add it to the new list
    theList.list.push(userName);
  }

  updateLabels();

});

/////////////////////////////////////////////////

$('document').ready(function(){

  // add style tags
  $('head').append('<style type="text/css"> .labelFake { color: #FF0000; } .labelCool { color: green; } button.blockUser, button.labelFake, button.labelUser { height: 16px; padding: 0 2px; color: white; background-color: #303030; } button.blockUser:hover { background-color: #FF0000; } button.labelFake:hover, button.labelUser:hover { background-color: #6E63C0; } a.fake { color: rgb(255, 0, 0); } a.shill { color: rgb(7,82,165); } a.bro { color: rgb(6,115,57); } .labelOptions { display: none; } .blockListDisplay { display: none; float: right; width: 90%; padding-top: 6px; }</style> <style type="text/css" id="fake"></style> <style type="text/css" id="shill"></style> <style type="text/css" id="bro"></style>');

  // code for buttons
  var blockButton = '&nbsp; <button type="button" class="blockUser">block</button>';
  var labelButton = '&nbsp; <button type="button" class="labelUser">label</button> <span class="labelOptions"> &nbsp; <a href="javascript:void(0)" class="fake">fake</a> | <a href="javascript:void(0)" class="shill">shill</a> | <a href="javascript:void(0)" class="bro">bro</a></span>';
  var blockListDisplay = '<div class="blockListDisplay" >Click to unblock: </div>';
  var numComments = $('.chat-message').length;

  // add buttons to existing comments
  $('.chat-message-head p').append(blockButton).append(labelButton);
  
  // add area to display blocked users
  $('.sidecontentbox').append(blockListDisplay);
  
  if (localStorage.getItem('blocked') != null) {
    blockedUserList = localStorage.getItem('blocked').split(',');
    updateBlockList();
  }
  
  if (localStorage.getItem('fake') != null) {
    fakeList.list = localStorage.getItem('fake').split(',');
  }
  
  if (localStorage.getItem('shill') != null) {
    shillList.list = localStorage.getItem('shill').split(',');
  }
  
  if (localStorage.getItem('bro') != null) {
    broList.list = localStorage.getItem('bro').split(',');
  }
  
  if ( (localStorage.getItem('fake') != null) ||
      (localStorage.getItem('shill') != null) ||
      (localStorage.getItem('bro') != null) ) {
    updateLabels();
  }


  //////////////////////////////////////////////////////// 
  // update display each time a new comment is added
  $('.chatContent').bind("DOMSubtreeModified",function(){

     // add buttons to newly added comment
     if ($('.chat-message').length > numComments) {
       numComments = $('.chat-message').length;
       $('.chat-message:last').find('.chat-message-head p').append(blockButton).append(labelButton);
    
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