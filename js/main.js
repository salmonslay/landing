window.onload = function () {
    setPage("projects");
    loadProjects();
};

/**
 * Sets the active page to the given page.
 * @param page The page to set as active.
 */
function setPage(page) {
    let p = document.getElementById("page-" + page);
    let b = document.getElementById("button-" + page);

    if (p === null || b === null)
        return;

    p.classList.remove("d-none");
    b.classList.add("active");

    let pages = document.getElementsByClassName("page");
    for (let i = 0; i < pages.length; i++) {
        if (pages[i] !== p)
            pages[i].classList.add("d-none");
    }

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

                let html = `
                    <li>
                        <figure>
                            <img class="thumbnail" src="${project.thumbnail}" alt="${project.title}">
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

                document.getElementById("project-gallery").innerHTML += html;
                // delete #loading
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