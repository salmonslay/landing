window.onload = function () {
    // set active page
    if (window.location.hash === "")
        setPage("projects");
    else
        setPage(window.location.hash.substring(1));

    loadProjects();

    $('.popup').click(function (event) {
        if ($(event.target).closest('.popup-content').length === 0) {
            closePopup();
        }
    });


    // <3
    if (window.location.hostname === "sofia.kiwi"){
        $('.is-sofia').show();
        $('.pronouns').show();
        $('.not-sofia').hide();
    }
    document.title = window.location.hostname === "sofia.kiwi" ? "Sofia" : "Fabian" + " Lindgren | Home";
};

/**
 * Sets the active page to the given page.
 * @param page The page to set as active.
 */
function setPage(page) {
    let p = document.getElementById("page-" + page);
    let b = document.getElementById("button-" + page);

    // set url hash
    window.location.hash = page;
    if (page === "projects")
        history.pushState("", document.title, window.location.pathname + window.location.search)

    // verify that the page exists
    if (p === null || b === null)
        return;

    // show page
    p.classList.remove("d-none");
    b.classList.add("active");

    // hide other pages
    let pages = document.getElementsByClassName("page");
    for (let i = 0; i < pages.length; i++) {
        if (pages[i] !== p)
            pages[i].classList.add("d-none");
    }

    // remove active from other buttons
    let buttons = document.getElementsByClassName("nav-button");
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i] !== b)
            buttons[i].classList.remove("active");
    }
}

const buttonIcons = {
    "github": "fab fa-github",
    "view": "fas fa-globe",
    "unity": "fab fa-unity",
    "documentation": "fas fa-book",
    "video": "fas fa-video",
    "leaderboard": "fa-solid fa-medal",
    "trailer": "fa-solid fa-film",
    "album": "fa-solid fa-images",
    "steam": "fa-brands fa-steam",
    "download": "fa-solid fa-download",
    "google play": "fa-brands fa-google-play",
    "blog": "fa-solid fa-feather-pointed",
}

const projects = {};

function loadProjects() {
    // get json file projects.json
    let request = new XMLHttpRequest();
    request.open("GET", "projects.json", true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.responseText);
            data.projects.forEach(project => {
                if (project.hidden)
                    return;

                // create pills
                let pillHtml = "";
                for (let key in project.tags) {
                    project.tags[key].forEach(tag => {
                        pillHtml += `<span class="pill color-${key}">${tag}</span>`;
                    });
                }

                // create buttons
                let buttonHtml = "";
                project.links.forEach(link => {
                    // find icon whose name exists in the link title
                    let icon = "fa-solid fa-link";
                    for (let key in buttonIcons) {
                        if (link.title.toLowerCase().includes(key)) {
                            icon = buttonIcons[key];
                            break;
                        }
                    }
                    buttonHtml += `<a class="button" href="${link.url}" target="_blank"><i class="${icon}"></i> ${link.title}</a>`;
                });

                // a project id is the project title with all non-alphanumeric characters removed and spaces replaced with dashes
                let projectId = project.title.replace(/ /g, "-")
                    .replace(/[^a-zA-Z0-9\-]/g, "")
                    .toLowerCase();

                // add thumbnail to image list and add an index
                project.index = 0;
                if (!project.images)
                    project.images = [];
                project.images.unshift(project.thumbnail);

                let projectHtml =
                    `
                    <li id="project-${projectId}">
                        <figure>
                            <div class="thumbnail-container">
                                <img class="thumbnail" src="${project.thumbnail}" alt="${project.title}">
                                
                                <!-- add arrows & dots if there is more than one image -->
                                ${project.images && project.images.length > 1 ? `
                                    <i class="fa-solid fa-chevron-left fa-xl arrow left-arrow" onclick="changeImage(true, '${projectId}');"></i>
                                    <i class="fa-solid fa-chevron-right fa-xl arrow right-arrow" onclick="changeImage(false, '${projectId}');"></i>
                                    
                                    <!-- add dots to make image switching easier -->
                                    <div class="dots">
                                        ${project.images.map((image, index) => `
                                        <span class="dot" onclick="changeImageTo(${index}, '${projectId}');"></span>`).join("")}</div>` : ``}
                            </div>
                            
                            <figcaption>
                                <h3>
                                    ${project.starred ? `<!--<i title="Large / important project" class="fas fa-star"></i>-->` : ``} 
                                    ${project.school ? `<i title="Project made for or in school" class="fa-solid fa-graduation-cap"></i>` : ``}
                                    ${project.title} 
                                </h3> 
                                <p class="short-description">${mdLinksToHtml(project.description)}</p>
                                <p class="long-description">${mdLinksToHtml(project.longDescription ? project.longDescription : project.description)}</p>
                                <div class="toolbar">
                                    <div class="pills">
                                        ${pillHtml}
                                    </div>
                                    <div class="buttons">
                                        ${buttonHtml}
                                        ${project.markdown ? `<a class="popup-button button" onclick="openPopup('project-${projectId}');">Read more...</a>` : ``}
                                    </div>
                                </div>
                            </figcaption>
                        </figure>
                    </li>
                    `

                // strip away html-comments
                projectHtml = projectHtml.replace(/<!--[\s\S]*?-->/g, "");

                // add active to the first dot
                projectHtml = projectHtml.replace(/class="dot"/, "class=\"dot active\"");

                document.getElementById("project-gallery").innerHTML += projectHtml;

                projects[projectId] = project;
            });
            document.getElementById("loading").remove();

        } else {
            document.getElementById("loading").innerHTML = "Error loading projects. That's awkward.";
        }
    }

    request.send();
}

function mdLinksToHtml(md) {
    md = md.replace(/\[(.*?)\]\((.*?)\)/g, "<a href=\"$2\">$1</a>");

    return md;
}

/**
 * Changes the currently displayed image of a project
 * @param left Whether to go left or right
 * @param projectId The id of the project
 */
function changeImage(left, projectId) {
    let project = projects[projectId];

    console.log(`going ${left ? "left" : "right"} on project ${projectId}`);

    project.index += left ? -1 : 1;
    if (project.index < 0)
        project.index = project.images.length - 1;
    else if (project.index >= project.images.length)
        project.index = 0;

    $(`#project-${projectId} .thumbnail`).attr("src", project.images[project.index]);

    // update active dot
    $(`#project-${projectId} .dot`).removeClass("active");
    $(`#project-${projectId} .dot:nth-child(${project.index + 1})`).addClass("active");
}

function changeImageTo(index, projectId) {
    let project = projects[projectId];

    console.log(`going to image ${index} on project ${projectId}`);

    project.index = index;

    $(`#project-${projectId} .thumbnail`).attr("src", project.images[project.index]);

    // update active dot
    $(`#project-${projectId} .dot`).removeClass("active");
    $(`#project-${projectId} .dot:nth-child(${project.index + 1})`).addClass("active");
}

function openPopup(id) {
    console.log(`opening popup ${id}`);
    $(".popup").addClass('active');


    // parse project markdown and add to popup
    let project = projects[id.replace("project-", "")];
    let div = $("#popup-content-html");
    div.html("Loading project...");

    // load markdown file (project.markdown)
    $.get(project.markdown, function (data) {
        div.html(marked.parse(data));
        hljs.highlightAll();
    }).fail(function (error) {
        div.html(`Something went wrong while loading the project description. That's awkward. <br> Error: ${error.statusText}`);
    });
}

function closePopup() {
    $(".popup").removeClass('active');
}