function setPage(page) {
    let p = document.getElementById(page);

    if (p === null)
        return;

    p.classList.remove("d-none");

    let pages = document.getElementsByClassName("page");
    for (let i = 0; i < pages.length; i++) {
        if (pages[i] !== p)
            pages[i].classList.add("d-none");
    }
}