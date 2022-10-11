// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';

export function getRenderLogin(url) {
  const templateUrl = /*html*/ `
        <div class="dropdown-content">
            <a id="logout" class="dropdown-content__link" href="#" data-cocktails>
                Login out
            </a>
        </div> `;
  return templateUrl;
}
export function renderUser(user, authBtn, boxAuthBtn) {
  authBtn.textContent = '';
  authBtn.style.backgroundImage = `url('${user.photoURL}')`;
  authBtn.style.width = '40px';
  authBtn.style.height = '50px';
  authBtn.style.borderRadius = '50%';
  authBtn.style.backgroundSize = 'contain';
  boxAuthBtn.insertAdjacentHTML('beforeend', getRenderLogin(user.photoURL));
  const logoutBtn = document.querySelector('#logout');
  logoutBtn.addEventListener('click', event => {
    event.preventDefault();
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        boxAuthBtn.innerHTML = `<button id="authBtn" type="button">Sing in</button>`;
      })
      .catch(error => {
        // An error happened.
      });
  });
}
