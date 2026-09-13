const {base} = require('../../constants.js');
const {makeMenu} = require("../../facilitators");
//idk
// 1. Build the master list of shape keys (strings)
const allShapeKeys = (() => {
    const list = [];

    // Normal Shapes & Rarity Variants
    const baseTypes = ["egg", "square", "triangle", "pentagon", "betaPentagon", "alphaPentagon", "hexagon"];
    const rarities = ["", "shiny", "legendary", "shadow", "rainbow", "trans"];
    for (let type of baseTypes) {
        const ct = type.charAt(0).toUpperCase() + type.slice(1);
        for (let r of rarities) {
            const key = r ? `${r}${ct}` : type;
            if (Class[key]) list.push(key);
        }
    }

    // Relics & Gem Relics
    const relicShapes = ["Egg", "Square", "Triangle", "Pentagon", "BetaPentagon", "AlphaPentagon", "Hexagon", "Hexagon_old", "Septagon", "Octagon", "Nonagon"];
    const gems = ["", "Power", "Space", "Reality", "Soul", "Time", "Mind"];
    for (let gem of gems) {
        for (let shape of relicShapes) {
            const key = `${gem}${shape}Relic`;
            if (Class[key]) list.push(key);
        }
    }

    // Labyrinth Shapes & Crashers
    for (let tier = 0; tier < 6; tier++) {
        for (let poly = 0; poly < 5; poly++) {
            for (let shiny = 0; shiny < 6; shiny++) {
                const baseKey = `laby_${poly}_${tier}_${shiny}_0`;
                const crasherKey = `laby_${poly}_${tier}_${shiny}_1`;
                if (Class[baseKey]) list.push(baseKey);
                if (Class[crasherKey]) list.push(crasherKey);
            }
        }
    }

    // Gems, Jewels, Polyhedra & Tesseract
    const specialShapes = ["gem", "jewel", "sphere", "cube", "tetrahedron", "octahedron", "dodecahedron", "icosahedron", "tesseract"];
    for (let shape of specialShapes) {
        if (Class[shape]) list.push(shape);
    }

    // Presents
    const presents = ["presentRY", "presentRP", "presentRW", "presentGY", "presentGP", "presentGW", "presentBY", "presentBP", "presentBW"];
    for (let present of presents) {
        if (Class[present]) list.push(present);
    }

    return list;
})();

// 2. Paginate into menus (15 per page, slot 16 reserved for navigation)
const pageSize = 15;
const totalPages = Math.ceil(allShapeKeys.length / pageSize);

// Create menu classes for each page
for (let p = 0; p < totalPages; p++) {
    const pageNum = p + 1;
    const menuKey = p === 0 ? "shapesMenu" : `shapesMenu_page_${pageNum}`;
    
    Class[menuKey] = makeMenu(`Shapes Menu (${pageNum}/${totalPages})`);
    Class[menuKey].UPGRADES_TIER_0 = [];
}

// Populate page upgrades and link "Next Page" / "Previous Page"
for (let p = 0; p < totalPages; p++) {
    const pageNum = p + 1;
    const currentMenuKey = p === 0 ? "shapesMenu" : `shapesMenu_page_${pageNum}`;
    
    // Add the 15 shapes for this page
    const start = p * pageSize;
    const pageItems = allShapeKeys.slice(start, start + pageSize);
    Class[currentMenuKey].UPGRADES_TIER_0.push(...pageItems);

    // Link Next Page button (16th slot)
    if (pageNum < totalPages) {
        const nextMenuKey = `shapesMenu_page_${pageNum + 1}`;
        Class[currentMenuKey].UPGRADES_TIER_0.push(nextMenuKey);
    } 
    // Optional: Link back to Page 1 on the last page if desired
    else if (totalPages > 1) {
        Class[currentMenuKey].UPGRADES_TIER_0.push("shapesMenu");
    }
}

// 3. Attach the main menu entry point
Class.menu_addons.UPGRADES_TIER_0.push("shapesMenu");
