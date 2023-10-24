function preloadImages(folder) {
    //    <link rel="preload" href="../images/icon.png" as="image">

    const extentions = [".jpg", ".jpeg", ".png", ".gif"]

    fetch(folder)
        .then((response) => response.text())
        .then((html) => {
            let parser = new DOMParser()
            let doc = parser.parseFromString(html, "text/html")
            let images = doc.getElementsByTagName("a")

            for (let i = 0; i < images.length; i++) {
                let imageUrl = images[i].getAttribute("href")

                if (extentions.some((ext) => imageUrl.endsWith(ext))) {
                    const imageLink = document.createElement("link")
                    imageLink.rel = "preload"
                    imageLink.href = folder + "/"+ imageUrl
                    imageLink.as = "image"
                    document.head.appendChild(imageLink)
                }
            }
        })
}

// preloading image elements
preloadImages("game/images")
preloadImages("game/images/characters/main")
preloadImages("game/images/characters/villains")

// preloading map elements
 preloadImages("game/level/sprites/level1")
 preloadImages("game/level/sprites/level2")
 preloadImages("game/level/sprites/level3")