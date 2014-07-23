Array.prototype.slice.call(document.querySelectorAll('a')).forEach(function (linkElement) {
    linkElement.addEventListener(function (event) {
        window.location = linkElement.getAttribute('data-href');
        event.preventDefault();
        event.stopPropagation();
    }, false);
});
