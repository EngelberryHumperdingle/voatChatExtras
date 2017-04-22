// voatChatXtras.js
// https://voat.co/user/EngelbertHumperdinck
//
// version 2.11

var blockedUserList = [];
var fakeList = { labelName: 'fake', labelColor: 'rgb(255, 0, 0)', list: [] };
var shillList = { labelName: 'shill', labelColor: 'rgb(7, 82, 165)', list: [] };
var broList = { labelName: 'bro', labelColor: 'rgb(6, 115, 57)', list: [] };
var labelLists = [fakeList, shillList, broList];
var blockedUserLinks = [];

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

  $('.blockListDisplay').html('Click to unblock: '+ blockedUserLinks.join(', ') );
}


/////////////////////////////////////////////////

function updateUserLabels(user, list, otherLists, label){
 
  console.log('---------------------\nupdatingUserLabels('+user+')');

  // ✡
  // STAR OF DAVID
  // Unicode: U+2721, UTF-8: E2 9C A1

  // 🐐
  // GOAT
  // Unicode: U+1F410 (U+D83D U+DC10), UTF-8: F0 9F 90 90

  $(labelLists).each(function(){
    //console.log('checking: '+this.labelName+' for: '+user);
    console.log('building: '+this.labelName);
    
    var theListHTML = [];
    $(this.list).each(function(){
        console.log('making rule for: '+this);
        theListHTML.push( 'div.chat-message-head a[href="/user/'+this+'"]' ); 
    });

    localStorage.setItem(label, this.list.join(','));
    $('style#'+this.labelName).html(theListHTML + '{color: '+this.labelColor+'}');

    if (this.list.length < 1) {
      localStorage.clear(label)
      $('style#'+this.labelName).html("");
    }        

  });

  $(labelLists).each(function(){
    console.log('\t'+this.labelName+': '+this.list);
  });
  
}

function initiateUserLabels(){
  console.log('------------------------------\ninitiateUserLabels()');

  $(labelLists).each(function(){
    console.log('building: '+this.labelName);
    try { console.log(this.list); }
    catch(e) { }

    var theListHTML = [];
    if ( this.list.length > 0 ) {
      this.list.each(function(){
        console.log('making css rule for: '+this);
        theListHTML.push('div.chat-message-head a[href="/user/'+this+'"]' );

      })  
      $('style#'+this.labelName).html(theListHTML + '{color: '+this.labelColor+'}');
    }
    else { 
      console.log('no list for '+this.labelName); 
      $('style#'+this.labelName).html("");
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
  // var theStyle = "";
  var theLabel = $(this).text();
  var userColor = $(this).parents('p').find('a').css('color');
  var labelColor = "";

  switch ( theLabel ) {
    case 'fake' : 
      theList = fakeList;
      theOtherLists = [shillList, broList];
      // theStyle = "{color: rgb(255, 0, 0)};";
      labelColor = "rgb(255, 0, 0)";
      break;
    case 'shill' : 
      theList = shillList;
      theOtherLists = [fakeList, broList];
      // theStyle = "{color: rgb(7, 82, 165);};";
      labelColor = "rgb(7, 82, 165)";
      break;
    case 'bro' : 
      theList = broList;
      theOtherLists = [fakeList, shillList];
      // theStyle = "{color: rgb(6, 115, 57)};";
      labelColor = "rgb(6, 115, 57)";
      break;
    default :
      // no list
      theOtherLists = [fakeList, shillList, broList];
      // theStyle = "{color: rgb(86, 168, 218)};";
      labelColor = "rgb(86, 168, 218)";
  }

  console.log('\n\ntheList: '+theList.labelName+'\nuserColor: '+userColor+', labelColor: '+labelColor);

  // if the user is already on the selected list
  if (userColor == labelColor) {
    // remove user from selected list
    theList.list.splice(theList.list.indexOf(userName), 1);

    // console
    console.log('\n removed '+userName+' from list: '+ theLabel);
    if (theList.list.length) console.log('\t theList.length: '+theList.list.length);
    else console.log('\t empty list');
    console.log('\t'+theList.list);

    // if the selected list is empty, remove it from localStorage
    if (theList.list.length < 1) localStorage.clear(theLabel);
  }
  else {
    console.log('user: '+ userName+' not on list: '+theList.labelName);
    // remove user from the other lists if present
    $(theOtherLists).each(function(i){
      console.log('checking: '+this.labelName+' for: '+userName);
      console.log(this.list.indexOf(userName) != -1);

      // if the user is on the list
      if ( this.list.indexOf(userName) != -1 ) {
        console.log(userName+' is on list: '+theOtherLists[i].labelName);
        this.list.splice(this.list.indexOf(userName), 1);
        console.log(userName + ' removed from list: '+this.labelName);
      }

    });

    // add it to the new list
    theList.list.push(userName);
    console.log('\n added '+userName+' to list: '+ theLabel);
    console.log('\t'+ theLabel+ '.length: '+theList.list.length);
    console.log('\t'+theList.list);
  }

  updateUserLabels(userName, theList, theOtherLists, theLabel);
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
  
  // get lists from localStorage
  if (localStorage.getItem('blocked') != null) {
    console.log('blocked: '+localStorage.getItem('blocked'));
    blockedUserList = localStorage.getItem('blocked').split(',');
    updateBlockList();
  }
  else { console.log('no blocked users'); }

  if (localStorage.getItem('fake') != null) {
    console.log('fake: '+localStorage.getItem('fake'));
    fakeList = localStorage.getItem('fake').split(',');
    console.log('fakeList: '+fakeList);
  }
  else { console.log('no fakes'); }

  if (localStorage.getItem('shill') != null) {
    console.log('shill: '+localStorage.getItem('shill'));
    shillList = localStorage.getItem('shill').split(',');
    console.log('shillList: '+shillList);
  }
  else { console.log('no shills'); }

  if (localStorage.getItem('bro') != null) {
    console.log('bro: '+localStorage.getItem('bro'));
    // broList = localStorage.getItem('bro').split(',');
    labelLists[2] = localStorage.getItem('bro').split(',');
    console.log('broList: '+broList);
  }
  else { console.log('no bros'); }

  if ( (localStorage.getItem('fake') != null) ||
      (localStorage.getItem('shill') != null) ||
      (localStorage.getItem('bro') != null) ) {
    initiateUserLabels();
  }
  else { console.log('no labels in localStorage'); }
   
  // update display each time a new comment is added
  $('.chatContent').bind("DOMSubtreeModified",function(){

     // add buttons to newly added comment
     if ($('.chat-message').length > numComments) {
       numComments = $('.chat-message').length;
       //$('.chat-message:last').find('.chat-message-head p').append(blockButton).append(fakeButton).append(coolButton);
       $('.chat-message:last').find('.chat-message-head p').append(blockButton).append(labelButton);
    
       updateBlockList();
     } 
  
  $('.chat-message-body p').each(function(){
    if ($(this).text().match(/FIST/g)) $(this).html($(this).html().replace(/FIST/g, 'CHEF'));
    if ($(this).text().match(/fist/g)) $(this).html($(this).html().replace(/fist/g, 'chef'));
  });
  });
  
});