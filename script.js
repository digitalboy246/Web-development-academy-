/* =========================
   WEBDEV ACADEMY
   FIREBASE + APP JAVASCRIPT
========================= */


/* =========================
   FIREBASE CONFIGURATION
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyAiMFtjoAAm0aNNp2vGZz2rBhMX8udYv-Y",
    authDomain: "web-development-academy-6.firebaseapp.com",
    projectId: "web-development-academy-6",
    storageBucket: "web-development-academy-6.firebasestorage.app",
    messagingSenderId: "519134503977",
    appId: "1:519134503977:web:ed31fdda6fea155a0f2838",
    measurementId: "G-DGQKR7W50L"
};


/* =========================
   START FIREBASE
========================= */

let firebaseApp;
let auth;
let db;
let currentStudent = null;

try {

    firebaseApp = firebase.initializeApp(firebaseConfig);

    auth = firebase.auth();

    db = firebase.firestore();

    console.log("🔥 Firebase connected successfully.");

} catch (error) {

    console.error(
        "Firebase initialization error:",
        error
    );

}


/* =========================
   AUTHENTICATION STATE
========================= */

if (auth) {

    auth.onAuthStateChanged(async function (user) {

        if (user) {

            currentStudent = user;

            console.log(
                "👤 Student logged in:",
                user.email
            );

            await createStudentProfile(user);

            await loadStudentData(user.uid);

        } else {

            currentStudent = null;

            console.log(
                "No student is currently logged in."
            );

        }

    });

}


/* =========================
   CREATE STUDENT PROFILE
========================= */

async function createStudentProfile(user) {

    if (!db) return;

    try {

        const studentRef =
            db.collection("students")
              .doc(user.uid);

        const studentSnap =
            await studentRef.get();


        if (!studentSnap.exists) {

            await studentRef.set({

                name:
                    user.displayName ||
                    "Student",

                email:
                    user.email || "",

                xp: 0,

                streak: 0,

                htmlProgress: 0,

                cssProgress: 0,

                jsProgress: 0,

                overallProgress: 0,

                completedLessons: [],

                badges: [],

                savedLessons: [],

                projects: [],

                createdAt:
                    firebase.firestore.FieldValue.serverTimestamp(),

                lastActive:
                    firebase.firestore.FieldValue.serverTimestamp()

            });

            console.log(
                "✅ Student profile created."
            );

        }

    } catch (error) {

        console.error(
            "Student profile error:",
            error
        );

    }

}


/* =========================
   LOAD STUDENT DATA
========================= */

async function loadStudentData(uid) {

    if (!db) return;

    try {

        const studentRef =
            db.collection("students")
              .doc(uid);

        const studentSnap =
            await studentRef.get();


        if (studentSnap.exists) {

            const data =
                studentSnap.data();


            window.studentData =
                data;


            console.log(
                "☁️ Student data loaded:",
                data
            );


            updateDashboard(data);

        }

    } catch (error) {

        console.error(
            "Could not load student data:",
            error
        );

    }

}


/* =========================
   UPDATE DASHBOARD
========================= */

function updateDashboard(data) {

    /*
       If we later add data-xp,
       data-streak and other attributes
       to the HTML, this function will
       automatically update them.
    */


    const xpElements =
        document.querySelectorAll(
            "[data-xp]"
        );


    xpElements.forEach(function (element) {

        element.textContent =
            data.xp || 0;

    });


    const streakElements =
        document.querySelectorAll(
            "[data-streak]"
        );


    streakElements.forEach(function (element) {

        element.textContent =
            data.streak || 0;

    });


    const progressElements =
        document.querySelectorAll(
            "[data-overall-progress]"
        );


    progressElements.forEach(function (element) {

        element.textContent =
            (data.overallProgress || 0) +
            "%";

    });

}


/* =========================
   SIDEBAR
========================= */

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");


if (menuBtn && sidebar) {

    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================
   PAGE NAVIGATION
========================= */

const navLinks =
    document.querySelectorAll(".nav-link");

const pages =
    document.querySelectorAll(".page");

const pageTitle =
    document.getElementById("pageTitle");


navLinks.forEach(function (link) {

    link.addEventListener(
        "click",
        function () {

            const pageName =
                link.dataset.page;


            if (!pageName) return;


            navLinks.forEach(
                function (item) {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            link.classList.add("active");


            pages.forEach(
                function (page) {

                    page.classList.remove(
                        "active-page"
                    );

                }
            );


            const selectedPage =
                document.getElementById(
                    pageName + "Page"
                );


            if (selectedPage) {

                selectedPage.classList.add(
                    "active-page"
                );

            }


            if (pageTitle) {

                pageTitle.textContent =
                    pageName
                        .charAt(0)
                        .toUpperCase() +
                    pageName.slice(1);

            }


            if (sidebar) {

                sidebar.classList.remove(
                    "open"
                );

            }


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

});


/* =========================
   DARK MODE
========================= */

const themeBtn =
    document.getElementById("themeBtn");


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark"
            );


            if (
                document.body.classList.contains(
                    "dark"
                )
            ) {

                themeBtn.textContent =
                    "☀️";

                localStorage.setItem(
                    "theme",
                    "dark"
                );

            } else {

                themeBtn.textContent =
                    "🌙";

                localStorage.setItem(
                    "theme",
                    "light"
                );

            }

        }
    );

}


/* LOAD SAVED THEME */

if (
    localStorage.getItem("theme") ===
    "dark"
) {

    document.body.classList.add("dark");


    if (themeBtn) {

        themeBtn.textContent =
            "☀️";

    }

}


/* =========================
   LESSON MODAL
========================= */

const lessonModal =
    document.getElementById(
        "lessonModal"
    );


function openLesson() {

    if (!lessonModal) return;

    lessonModal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


function closeLesson() {

    if (!lessonModal) return;

    lessonModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "auto";

}


/* CLOSE MODAL OUTSIDE */

if (lessonModal) {

    lessonModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                lessonModal
            ) {

                closeLesson();

            }

        }
    );

}


/* =========================
   TEACHER LESSON SYSTEM
========================= */

const teaching = [

    "Welcome back! Today we're going to learn about HTML attributes.",

    "An attribute gives additional information about an HTML element.",

    "Attributes are normally written inside the opening tag.",

    "For example, href is an attribute used by the anchor tag to tell the browser where a link should go.",

    "Excellent! Now let's test what you've learned."

];


let teachingIndex = 0;


const teacherText =
    document.getElementById(
        "teacherText"
    );


function showTeaching() {

    if (!teacherText) return;

    teacherText.textContent =
        teaching[teachingIndex];

}


function nextTeaching() {

    if (
        teachingIndex <
        teaching.length - 1
    ) {

        teachingIndex++;

        showTeaching();

    }

}


function previousTeaching() {

    if (teachingIndex > 0) {

        teachingIndex--;

        showTeaching();

    }

}


function playTeaching() {

    const text =
        teaching[teachingIndex];


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.rate = 0.85;

    speech.pitch = 1;


    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
        speech
    );

}


/* =========================
   QUIZ
========================= */

function answerQuiz(
    button,
    correct
) {

    const result =
        document.getElementById(
            "quizResult"
        );


    if (!result) return;


    if (correct) {

        button.style.borderColor =
            "#16a34a";

        button.style.background =
            "#f0fdf4";


        result.textContent =
            "✓ Correct! +20 XP";


        result.style.color =
            "#16a34a";

    } else {

        button.style.borderColor =
            "#dc2626";

        button.style.background =
            "#fef2f2";


        result.textContent =
            "Not quite. Try again.";


        result.style.color =
            "#dc2626";

    }

}


/* =========================
   COMPLETE LESSON
========================= */

async function completeLesson() {

    if (!currentStudent) {

        alert(
            "Please log in before completing a lesson."
        );

        return;

    }


    if (!db) {

        alert(
            "Firebase is not connected."
        );

        return;

    }


    try {

        const studentRef =
            db.collection("students")
              .doc(currentStudent.uid);


        const lessonId =
            "html-attributes-lesson-4";


        await studentRef.update({

            xp:
                firebase.firestore.FieldValue
                    .increment(50),

            completedLessons:
                firebase.firestore.FieldValue
                    .arrayUnion(lessonId),

            lastActive:
                firebase.firestore.FieldValue
                    .serverTimestamp()

        });


        await loadStudentData(
            currentStudent.uid
        );


        alert(
            "🎉 Lesson completed! You earned 50 XP."
        );


        closeLesson();


    } catch (error) {

        console.error(
            "Lesson completion error:",
            error
        );


        alert(
            "Could not save your progress. Please try again."
        );

    }

}


/* =========================
   CODE PLAYGROUND
========================= */

function runCode() {

    const editor =
        document.getElementById(
            "codeEditor"
        );


    const preview =
        document.getElementById(
            "preview"
        );


    if (!editor || !preview) return;


    const code =
        editor.value;


    preview.srcdoc =
        code;

}


/* =========================
   INITIALIZATION
========================= */

window.addEventListener(
    "load",
    function () {

        runCode();

        showTeaching();

        console.log(
            "🚀 WebDev Academy loaded."
        );

    }
);


/* =========================
   MAKE FUNCTIONS AVAILABLE
   TO HTML
========================= */

window.openLesson =
    openLesson;

window.closeLesson =
    closeLesson;

window.nextTeaching =
    nextTeaching;

window.previousTeaching =
    previousTeaching;

window.playTeaching =
    playTeaching;

window.answerQuiz =
    answerQuiz;

window.completeLesson =
    completeLesson;

window.runCode =
    runCode;


/* =========================
   STUDENT ACCESS
========================= */

window.getCurrentStudent =
    function () {

        return currentStudent;

    };


window.getStudentData =
    function () {

        return window.studentData ||
               null;

    };


/* =========================
   FIREBASE STATUS
========================= */

console.log(
    "🔥 WebDev Academy Firebase system ready."
);
/* =========================
   REGISTER + LOGIN SYSTEM
========================= */


/* AUTH ELEMENTS */

const authScreen =
    document.getElementById("authScreen");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");


/* =========================
   SWITCH TO REGISTER
========================= */

const showRegisterBtn =
    document.getElementById(
        "showRegisterBtn"
    );


if (showRegisterBtn) {

    showRegisterBtn.addEventListener(
        "click",
        function () {

            loginForm.style.display =
                "none";

            registerForm.style.display =
                "block";

        }
    );

}


/* =========================
   SWITCH TO LOGIN
========================= */

const showLoginBtn =
    document.getElementById(
        "showLoginBtn"
    );


if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        function () {

            registerForm.style.display =
                "none";

            loginForm.style.display =
                "block";

        }
    );

}


/* =========================
   REGISTER
========================= */

const registerBtn =
    document.getElementById(
        "registerBtn"
    );


if (registerBtn) {

    registerBtn.addEventListener(
        "click",
        async function () {

            const name =
                document.getElementById(
                    "registerName"
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            /* VALIDATION */

            if (!name) {

                message.textContent =
                    "Please enter your name.";

                message.style.color =
                    "#dc2626";

                return;

            }


            if (!email) {

                message.textContent =
                    "Please enter your email.";

                message.style.color =
                    "#dc2626";

                return;

            }


            if (password.length < 6) {

                message.textContent =
                    "Password must be at least 6 characters.";

                message.style.color =
                    "#dc2626";

                return;

            }


            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.style.color =
                    "#dc2626";

                return;

            }


            try {

                registerBtn.disabled =
                    true;

                registerBtn.textContent =
                    "Creating account...";


                /* CREATE FIREBASE ACCOUNT */

                const userCredential =
                    await auth.createUserWithEmailAndPassword(
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                /* SAVE USER NAME */

                await user.updateProfile({

                    displayName: name

                });


                /* CREATE FIRESTORE PROFILE */

                await db
                    .collection("students")
                    .doc(user.uid)
                    .set({

                        name: name,

                        email: email,

                        xp: 0,

                        streak: 0,

                        htmlProgress: 0,

                        cssProgress: 0,

                        jsProgress: 0,

                        overallProgress: 0,

                        completedLessons: [],

                        badges: [],

                        savedLessons: [],

                        projects: [],

                        createdAt:
                            firebase.firestore
                            .FieldValue
                            .serverTimestamp(),

                        lastActive:
                            firebase.firestore
                            .FieldValue
                            .serverTimestamp()

                    });


                message.textContent =
                    "🎉 Account created successfully!";

                message.style.color =
                    "#16a34a";


                console.log(
                    "Account created:",
                    user.email
                );


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                message.textContent =
                    getFirebaseErrorMessage(
                        error
                    );

                message.style.color =
                    "#dc2626";


            } finally {

                registerBtn.disabled =
                    false;

                registerBtn.textContent =
                    "Create Account";

            }

        }
    );

}


/* =========================
   LOGIN
========================= */

const loginBtn =
    document.getElementById(
        "loginBtn"
    );


if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        async function () {

            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            if (!email || !password) {

                message.textContent =
                    "Enter your email and password.";

                message.style.color =
                    "#dc2626";

                return;

            }


            try {

                loginBtn.disabled =
                    true;

                loginBtn.textContent =
                    "Logging in...";


                await auth
         .signInWithEmailAndPassword(
                        email,
                        password
                    );


                message.textContent =
                    "✓ Login successful!";

                message.style.color =
                    "#16a34a";


                console.log(
                    "Student logged in."
                );


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                message.textContent =
                    getFirebaseErrorMessage(
                        error
                    );

                message.style.color =
                    "#dc2626";


            } finally {

                loginBtn.disabled =
                    false;

                loginBtn.textContent =
                    "Login";

            }

        }
    );

}


/* =========================
   SHOW/HIDE AUTH SCREEN
========================= */

if (auth) {

    auth.onAuthStateChanged(
        function (user) {

            if (user) {

                /* STUDENT IS LOGGED IN */

                if (authScreen) {

                    authScreen.style.display =
                        "none";

                }


                console.log(
                    "🔓 Dashboard unlocked."
                );


            } else {

                /* STUDENT IS LOGGED OUT */

                if (authScreen) {

                    authScreen.style.display =
                        "flex";

                }


                console.log(
                    "🔒 Login required."
                );

            }

        }
    );

}


/* =========================
   FIREBASE ERROR MESSAGES
========================= */

function getFirebaseErrorMessage(
    error
) {

    switch (error.code) {

        case "auth/email-already-in-use":

            return "This email already has an account.";

        case "auth/invalid-email":

            return "Please enter a valid email.";

        case "auth/weak-password":

            return "Password is too weak.";

        case "auth/user-not-found":

            return "No account was found with this email.";

        case "auth/wrong-password":

            return "Incorrect password.";

        case "auth/invalid-credential":

            return "Incorrect email or password.";

        case "auth/network-request-failed":

            return "Check your internet connection.";

        default:

            return "Something went wrong. Please try again.";

    }

}


/* =========================
   LOGOUT
========================= */

window.logoutStudent =
    async function () {

        try {

            await auth.signOut();

            console.log(
                "Student logged out."
            );

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };
