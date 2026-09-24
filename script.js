const build = {
    weapon: null,
    oils: {attack: true, armor: true, speed: true},
    items: [null, null, null, null]
};

let selectedIndex = null;

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

                box.addEventListener("click", () => {
                    if (item.category === "weapon") {
                        build.weapon = item;
                    } else {
                        const emptyIndex = build.items.indexOf(null);
                        if (emptyIndex !== -1) {
                            build.items[emptyIndex] = item;
                        }
                    }

                    renderBuild();
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

function renderBuild() {
    const weaponSlot = document.querySelector(".weapon-slot");
    weaponSlot.innerHTML = "";

    if (build.weapon !== null) {
        const img = document.createElement("img");
        img.src = "assets/weapons/" + build.weapon.image;
        img.alt = build.weapon.name;
        weaponSlot.appendChild(img);
    }

    const itemSlotElements = document.querySelectorAll(".item-slot-build");

    build.items.forEach((item, index) => {
        const slotElement = itemSlotElements[index];
        slotElement.innerHTML = "";

        if (item !== null) {
            const img = document.createElement("img");
            img.src = "assets/items/" + item.image;
            img.alt = item.name;
            slotElement.appendChild(img);
        }

        if (index === selectedIndex) {
            slotElement.classList.add("selected");
        } else {
            slotElement.classList.remove("selected");
        }
    });

    const stats = calculateStats();
    document.querySelector(".health").textContent = stats.health;
    document.querySelector(".attack").textContent = stats.attack;
    document.querySelector(".armor").textContent = stats.armor;
    document.querySelector(".speed").textContent = stats.speed;

    document.querySelectorAll(".oil-toggle").forEach(el => {
        if (build.oils[el.dataset.stat]) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    })
}

function handleSlotClick(index) {
    if (build.items[index] === null) {
        return;
    }

    if (selectedIndex === null) {
        selectedIndex = index;
    } else if (selectedIndex === index) {
        build.items[index] = null;
        selectedIndex = null;
    } else {
        const temp = build.items[selectedIndex];
        build.items[selectedIndex] = build.items[index];
        build.items[index] = temp;
        selectedIndex = null;
    }

    renderBuild();
}

function handleWeaponClick() {
    if (build.weapon === null) {
        return;
    }
    
    build.weapon = null;
    renderBuild();
    
}

function calculateStats() {
    const totals = { health: 10, attack: 0, armor: 0, speed: 0 };

    if (build.weapon !== null) {
        totals.health += build.weapon.healthBonus;
        totals.attack += build.weapon.attack;
        totals.armor += build.weapon.armor;
        totals.speed += build.weapon.speed;
    };

    build.items.forEach(item => {
        if (item !== null) {
            totals.health += item.healthBonus;
            totals.attack += item.attack;
            totals.armor += item.armor;
            totals.speed += item.speed;
        }
    });

    if (build.oils.attack) {
        totals.attack += 1;
    }
    if (build.oils.armor) {
        totals.armor += 1;
    }
    if (build.oils.speed) {
        totals.speed += 1;
    }

    return totals;
}

function handleOilClick(statName) {
    build.oils[statName] = !build.oils[statName];
    renderBuild()
}

const itemSlotElements = document.querySelectorAll(".item-slot-build");
itemSlotElements.forEach((slotElement, index) => {
    slotElement.addEventListener("click", () => handleSlotClick(index));
});

const weaponSlotElement = document.querySelector(".weapon-slot");
weaponSlotElement.addEventListener("click", () => handleWeaponClick());

document.querySelectorAll(".oil-toggle").forEach(el => {
    el.addEventListener("click", () => handleOilClick(el.dataset.stat));
});

loadItems("data/weapons.json", "assets/weapons/");
loadItems("data/items.json", "assets/items/");
renderBuild();