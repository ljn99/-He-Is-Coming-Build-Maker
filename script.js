function loadItems(jsonPath, imageFolder) {
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            const grid = document.querySelector(".item-grid");

            data.forEach(item => {
                const box = document.createElement("div");
                box.classList.add("item-slot");

                const tooltip = document.getElementById("tooltip");

                box.addEventListener("mouseenter", () => {
                    tooltip.style.display = "block";
                    tooltip.innerHTML = buildTooltipText(item).replaceAll("\n", "<br>");
                });

                box.addEventListener("mouseleave", () => {
                    tooltip.style.display = "none";
                })

                box.addEventListener("mousemove", (event) => {
                    tooltip.style.left = event.pageX + 10 + "px";
                    tooltip.style.top = event.pageY + 10 + "px";
                })

                const img = document.createElement("img");
                img.src = imageFolder + item.image;
                img.alt = item.name;

                box.appendChild(img);
                grid.appendChild(box);
            });
        });
}

function buildTooltipText(item) {
    let text = item.name;

    if (item.description !== null) {
        text = text + "\n" + item.description;
    }

    if (item.attack !== 0) {
    text = text + "\nAttack: " + item.attack;
    }
    if (item.armor !== 0) {
        text = text + "\nArmor: " + item.armor;
    }
    if (item.speed !== 0) {
        text = text + "\nSpeed: " + item.speed;
    }
    if (item.healthBonus !== 0) {
        text = text + "\nHealth: " + item.healthBonus;
    }

    if (item.tags.length > 0) {
        text = text + "\nTags: " + item.tags.join(", ");
    }

    return text;
}

loadItems("data/weapons.json", "assets/weapons/");
loadItems("data/items.json", "assets/items/");