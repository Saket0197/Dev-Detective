const changeToMode = document.querySelector('.change-to-mode');
const icon = document.querySelector('.icon');
const sunIcon = "./Assets/sun-icon.svg";
const moonIcon = "./Assets/moon-icon.svg";
const root = document.documentElement.style;
const inputBox = document.querySelector('input[type = "search"]');
const notFound = document.querySelector('.not-found');
const base_url = "https://api.github.com/users/";
const searchBtn = document.querySelector('.search-btn');
const overlay = document.querySelector('.overlay');
const myUserName = "Saket0197";

const getDomElement = (className) => {return document.querySelector(`.${className}`);}

const profileImage = getDomElement('profile-image');
const toUserGithub = getDomElement('user-github-link');
const userName = getDomElement('user-name'); 
const userJoinDate = getDomElement('user-join-date');
const userBio = getDomElement('user-bio');
const userRepos = getDomElement('repos-value');
const followers = getDomElement('followers-value');
const following = getDomElement('following-value');
const loc = getDomElement('location-info');
const bioLink = getDomElement('bio-link-info');
const twitter = getDomElement('twitter-info');
const organization = getDomElement('organization-info');


let url = "";
let isDarkMode = null;

icon.addEventListener('click', () => {
    switchMode();
});

searchBtn.addEventListener('click',()=>{
    if(inputBox.value) {
        url = base_url + inputBox.value;
        getData(url);
    }
});

inputBox.addEventListener('keydown',(event) => {
    if(event.key === "Enter" && inputBox.value) {
        url = base_url + inputBox.value;
        getData(url);
    }
});

overlay.addEventListener('click',() => {
    overlay.classList.remove('active');
});

function switchMode() {
    if(icon.classList.contains('darkModeOn')) {
        setLightMode();
        isDarkMode = false;
    }
    else{
        setDarkMode();
        isDarkMode = true;
    }
    localStorage.setItem('userPreference',isDarkMode.toString());
    icon.classList.toggle('darkModeOn');
}

function setLightMode() {
    changeToMode.textContent = "DARK";
    icon.src = moonIcon;

    root.setProperty('--lm-bg','#f6f8ff');
    root.setProperty('--lm-bg-content','#fefefe');
    root.setProperty('--lm-text','#4b6a9b');
    root.setProperty('--lm-text-alt','#2b3442');
    root.setProperty('--lm-shadow','rgba(70, 96, 187, 0.2)');
    root.setProperty('--lm-icon-bg','#141D2F');
}

function setDarkMode() {
    changeToMode.textContent = "LIGHT";
    icon.src = sunIcon;

    root.setProperty('--lm-bg','#141D2F');
    root.setProperty('--lm-bg-content','#1E2A47');
    root.setProperty('--lm-text','white');
    root.setProperty('--lm-text-alt','white');
    root.setProperty('--lm-shadow','rgba(70,88,109,0.15)');
    root.setProperty('--lm-icon-bg','#141D2F');
}

function formatDate(d) {
    const date = new Date(d);
    const month = date.toLocaleString('en-US',{month:'long'});
    const day = date.toLocaleString('en-US',{day:'2-digit'});
    const year = date.getFullYear();
    const completeDate = day+' '+month+' '+year;
    return completeDate;
}

function renderData(response) {

    if(response === null) {

        profileImage.src = "";
        toUserGithub.textContent = "";
        toUserGithub.href = "#";
        userName.textContent = "";
        userJoinDate.textContent = "";
        userBio.textContent = "";
        userRepos.textContent = "";
        followers.textContent = "";
        following.textContent = "";
        loc.textContent = "";
        bioLink.textContent = "";
        twitter.textContent = "";
        organization.textContent = "";
        return;
    }

    profileImage.src = response?.avatar_url;
    toUserGithub.textContent = `@${response?.login}`;
    toUserGithub.href = response?.html_url;
    toUserGithub.target = "_blank";
    userName.textContent = response?.name;
    userJoinDate.textContent = `Joined ${formatDate(response?.created_at)}`;
    userBio.textContent = response?.bio;
    userRepos.textContent = response?.public_repos;
    followers.textContent = response?.followers;
    following.textContent = response?.following;

    if(response?.location) {
        loc.textContent = response?.location;
    }
    
    if(response?.blog) {
		bioLink.href = response?.blog;
        bioLink.textContent = response?.blog;
        bioLink.target = '_blank';
    }
    
    if(response?.twitter_username) {
        twitter.textContent = response?.twitter_username;
        twitter.href = `https://twitter.com/${response?.twitter_username}`;
        twitter.target = '_blank';
    }
    
    if(response?.company) {
        organization.textContent = response?.company;
    }
    
}

async function getData(url) {

    if(!url) {
        return;
    }

    try{
        const result = await fetch(url);
        const response = await result.json();

        if(response?.message === 'Not Found' && (!overlay.classList.contains('active'))) {
            inputBox.value="";
            overlay.classList.add('active');
            renderData(null);
            return;
        }

        renderData(response);

    } catch(err) {

        console.log('Error occurred while fetching api data');
        console.error(err.message);
    }

}

if(!localStorage.getItem('userPreference')) {
    isDarkMode = window.matchMedia('(prefers-color-scheme:dark)').matches;
    localStorage.setItem('userPreference',isDarkMode.toString());
}

function initDefault() {
    url = base_url + myUserName;
    if(localStorage.getItem('userPreference') !== 'true') {
        setLightMode();
    }
    else{
        setDarkMode();
    }
    getData(url);
}

initDefault();