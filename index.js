// @ts-nocheck
import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

/* FIREBASE SETTINGS */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://twimba-983ed-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const twimbaInDataBase = ref(database, "twimba");
console.log(twimbaInDataBase);

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.replyMessage) {
    /* Reply Icon target */
    handleReplyMessage(e.target.dataset.replyMessage);
    /*        handleReplyClick(e.target.dataset.replyMessage) 
 
*/
  } else if (e.target.dataset.replyMessageBtn) {
    handleTweetReplyButton();
  } else if (e.target.dataset.replyMessageClosed) {
    replyMessageClosed();
  }
  console.log(e.target.dataset);
});

/* REPLY MESSAGE */

function handleReplyMessage(replyM) {
  /* Replies Message Modal */

  let repliesMessage = `
<div class="reply" id="reply">
  <div class="reply-btns-div">
    <span class="tweet-detail-reply">
      <i class="fas fa-window-close" style="color: #3d48d6" data-reply-message-closed=${replyM} ></i>
    </span>
    <button class="reply-btn" data-reply-message-btn=${replyM} >Your message</button>
  </div>
  <div class="reply-text-area">
    <img src="images/scrimbalogo.png" class="profile-pic" />
    <textarea
      placeholder="Your message."
      class="tweet-message-reply"
      id="tweet-message-reply"
    ></textarea>
  </div>
`;

  document.getElementById("reply-main").innerHTML = repliesMessage;

  /* console.log(repliesMessage); */

  render();

  /*  return repliesMessage; */
}

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });

    render();
    tweetInput.value = "";
  }
}

console.log(tweetsData.replies);
/* Handle tweet message reply button */
/* To Do */
function handleTweetReplyButton(replyM) {
  const messageReply = document.getElementById("tweet-message-reply");
  const replyMain = document.getElementById("reply-main");

  if (messageReply.value) {
    tweetsData.forEach(function (tweet) {
      tweet.replies.unshift({
        profilePic: `images/scrimbalogo.png`,
        handle: `@Scrimba`,
        tweetText: messageReply.value,
        uuid: uuidv4(),
      });

      console.log(tweet.replies);
    });

    messageReply.value = "";
    replyMain.innerHTML = "";

    console.log("message written");
  }
  render();
}

/* Done */
function replyMessageClosed(replyM) {
  const replyMain = document.getElementById("reply-main");
  replyMain.innerHTML = "";
  render();
  /* console.log(replyM); */
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
      });
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                
                <span class="tweet-detail"> 
                
         
                <i class="fa-solid fa-reply" data-reply-message="${tweet.uuid}"></i>
                </span>
                
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                    
                </span>

            </div>   
        </div>   
         
  
      </div>
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`;
  });

  push(twimbaInDataBase, tweetsData);

  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
