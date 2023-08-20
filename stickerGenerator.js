class stickerGenerator {
    constructor(config) {
        console.debug(config);
        var genesis = document.getElementById(config.genesisElementId);
        if (!genesis) {
            console.error(`Unable to find element with id (${config?.genesisElementId}) specified in config.genesisElementId`);
            return;
        }
        if (config.codes_per_grouping < 1) {
            config.codes_per_grouping = 1;
            console.warn(`Invalid value for codes_per_grouping (${config.codes_per_grouping}). Setting it to 1`);
        }
        if (config.codes_per_grouping > 0 && config.codes_per_page % config.codes_per_grouping != 0) {
            console.error(`Codes per page (${config.codes_per_page}) must be a divisor of codes per grouping (${config.codes_per_grouping})`);
            return;
        }
        let added = 0;
        let lastGroup = -1;
        let lastCode = '';
        const MAX_CODES = 3000;
        const iv = setInterval(function () {
            const groupNum = Math.floor(added / config.codes_per_grouping);
            let codigo = (groupNum != lastGroup) ? lastCode = config.getCode(added) : lastCode;
            lastGroup = groupNum;
            if (added > MAX_CODES || codigo === false) {
                if (added > MAX_CODES) console.error(`Exceeded arbitrary limit of ${MAX_CODES} codes.`);
                clearInterval(iv);
                return;
            }
            addStickerToElement(getOrAddGrouping(added, groupNum), codigo, added);
            added++;
        }, 1);

        function getOrAddGrouping(added, groupNum) {
            const curPage = getOrAddA4Page(added);
            if (config.codes_per_grouping === 0) return curPage;
            const groupId = "grp_" + groupNum;
            var groupEl = document.getElementById(groupId);
            if (!groupEl) {
                console.debug(`Adding a new group (class: grp) with id: ${groupId}. Added == ${added}`);
                groupEl = document.createElement("span");
                groupEl.classList.add("grp");
                groupEl.id = groupId;
                curPage.appendChild(groupEl);
            }
            return groupEl;
        }

        function getOrAddA4Page(added) {
            const pid = "page_" + Math.floor(added / config.codes_per_page);
            var curPage = document.getElementById(pid);
            if (!curPage) {
                console.debug("Adding a new A4 (class: a4) page with id:", pid);
                curPage = document.createElement("div");
                curPage.classList.add("a4");
                curPage.id = pid;
                let pages = document.getElementById('pages');
                if (!pages) {
                    pages = document.createElement("div");
                    pages.id = 'pages';
                    document.body.appendChild(pages);
                }
                pages.appendChild(curPage);
            }
            return curPage;
        }

        function addStickerToElement(element, codigo, added) {
            let clone = genesis.cloneNode(true);
            clone.getElementsByClassName("codival")[0].innerHTML = codigo;
            const barcoId = "qrc_" + added;
            clone.getElementsByClassName("qrco")[0].id = barcoId;
            clone.id = "clone_" + added;
            element.appendChild(clone);

            new QRCode(barcoId, {
                text: codigo,
                width: 32,
                height: 32,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

        }
    }

    static GetDefaultConfig = function () {
        return {
            codes_per_grouping: 3, // Set to 0 to disable
            codes_per_page: 90,
            genesisElementId: 'genesis',
            getCode: seed => (seed > BatchSize) ? false : cvt.Convert(seed)
        }
    }
}
