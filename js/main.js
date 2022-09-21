window.onload = function () {
    if (window.location.hash === "")
        setPage("projects");
    else
        setPage(window.location.hash.substring(1));

    loadProjects();
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

function loadProjects() {
    // get json file projects.json
    let request = new XMLHttpRequest();
    request.open("GET", "projects.json", true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.responseText);
            data.projects.forEach(project => {

                let pillHtml = "";
                for (let key in project.tags) {
                    project.tags[key].forEach(tag => {
                        pillHtml += `<span class="pill color-${key}">${tag}</span>`;
                    });
                }

                let buttonHtml = "";
                project.links.forEach(link => {
                    buttonHtml += `<a class="button" href="${link.url}" target="_blank">${link.title}</a>`;
                });

                document.getElementById("project-gallery").innerHTML +=
                    `
                    <li>
                        <figure>
                            <div class="parent">
                                ${project.starred ? `<i title="Large / important project" class="fas fa-star star"></i>` : ``}
                                <img class="thumbnail" src="${project.thumbnail}" alt="${project.title}">
                            </div>
                            <figcaption>
                                <p>${project.title}</p>
                                <p>${mdToHtml(project.description)}</p>
                                <div class="pills">
                                    ${pillHtml}
                                </div>
                                <div class="buttons">
                                    ${buttonHtml}
                                </div>
                            </figcaption>
                        </figure>
                    </li>
                    `
            });
            document.getElementById("loading").remove();

        } else {
            document.getElementById("loading").innerHTML = "Error loading projects. That's awkward.";
        }
    }

    request.send();
}

function mdToHtml(md) {
    md = md.replace(/\[(.*?)\]\((.*?)\)/g, "<a href=\"$2\">$1</a>");

    return md;
}