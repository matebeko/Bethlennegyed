document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-navigation');

    menuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('show');
        
        // Change icon from hamburger (☰) to close (✕) when opened
        if (mainNav.classList.contains('show')) {
            menuBtn.innerHTML = '✕';
        } else {
            menuBtn.innerHTML = '☰';
        }
    });

    // Post loading of new items
    const hirekTarolo = document.getElementById('hirek-tarolo');
    
    if (hirekTarolo) {
        const TABLAZAT_ID = '1tgiwaOBXxuGPuZPUyWuO8_5UArjbXBOFNMyxFnRmAYA'; 
        
        const url = `https://docs.google.com/spreadsheets/d/${TABLAZAT_ID}/gviz/tq?tqx=out:json`;

        fetch(url)
            .then(res => res.text())
            .then(text => {
                const data = JSON.parse(text.substr(47).slice(0, -2));
                const rows = data.table.rows;
                
                hirekTarolo.innerHTML = ''; // "Betöltés folyamatban..." 

                // Végigmegyünk a táblázat sorain (a legújabbak felülre kerülnek, ha visszafelé olvassuk)
                for (let i = rows.length - 1; i > 0; i--) {
                    const row = rows[i];
                    
                    // Ha a sor teljesen üres, ugorjuk át
                    if (!row || !row.c || !row.c[0]) continue; 

                    // Oszlopok beolvasása (A: Dátum, B: KépURL, C: Szöveg)
                    const datum = row.c[0] ? row.c[0].v : '';
                    const kepUrl = row.c[1] ? row.c[1].v : null; 
                    const szoveg = row.c[2] ? row.c[2].v : '';

                    // HTML kártya felépítése
                    let html = `<article class="event-card">`;
                    
                    if (kepUrl) {
                        html += `<img src="${kepUrl}" alt="A hír hamarosan újból látható lesz">`;
                    }
                    
                    if (szoveg) {
                        html += `
                            <p class="event-caption" style="margin-top: 15px;">
                                <strong>${szoveg}</strong>
                            </p>`;
                    }

                    html += `
                    </article>
                    <hr style="width: 50%; margin: 30px auto; border: 1px solid #C3975D;">
                    `;
                    
                    hirekTarolo.innerHTML += html;
                }
            })
            .catch(error => {
                console.error('Hiba történt a hírek beolvasásakor:', error);
                hirekTarolo.innerHTML = '<p style="text-align: center; color: red;">Jelenleg nem sikerült betölteni a híreket.</p>';
            });
    }
});


/* ==========================================================================
   SITE SEARCH (client-side, no backend)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const resultsBox = document.getElementById('search-results');

    if (!form || !input || !resultsBox) return;

    // Searchable index of the whole site. Each entry points to a page
    // (optionally to a section anchor) and carries keywords for matching.
    const INDEX = [
        // Aktuális / kezdőlap
        { title: 'Aktuális – Hírek', page: 'Aktuális', url: 'index.html',
          keywords: 'aktuális hírek kezdőlap főoldal köszöntjük honlapunkon újdonságok' },

        // Lelkészi Hivatal
        { title: 'A Lelkészi Hivatal programja', page: 'Lelkészi Hivatal', url: 'hivatal.html#program',
          keywords: 'program nyitvatartás nyitva tartás hivatal hétfő kedd szerda csütörtök péntek óra időpont ügyfélfogadás' },
        { title: 'Kapcsolat', page: 'Lelkészi Hivatal', url: 'hivatal.html#kapcsolat',
          keywords: 'kapcsolat cím telefon telefonszám mobil email e-mail elérhetőség cipészek utca bethlennegyed@gmail.com' },
        { title: 'A Lelkészi Hivatal', page: 'Lelkészi Hivatal', url: 'hivatal.html#hivatal',
          keywords: 'lelkészi hivatal parókia gyülekezeti bejárat csengő épület' },
        { title: 'A templom', page: 'Lelkészi Hivatal', url: 'hivatal.html#templom',
          keywords: 'templom kazánház harangláb bethlenfalvi cipészek lakatosok győzelem várdai zsolt megközelítés parkolás autó' },

        // Közérdekű Információk
        { title: 'Egyházfenntartói adomány', page: 'Közérdekű Információk', url: 'informaciok.html#egyhaz',
          keywords: 'egyházfenntartás egyházfenntartói adomány járulék fizetés összeg lej százalék jövedelem támogatás' },
        { title: 'Keresztelések', page: 'Közérdekű Információk', url: 'informaciok.html#keresztel',
          keywords: 'keresztelés keresztelő keresztség gyermek baba sákramentum' },
        { title: 'Konfirmáció', page: 'Közérdekű Információk', url: 'informaciok.html#konfi',
          keywords: 'konfirmáció konfirmálás káté felkészítő úrvacsora fiatalok osztály' },
        { title: 'Kisgyermekek az istentiszteleten', page: 'Közérdekű Információk', url: 'informaciok.html#gyermekek',
          keywords: 'gyermek gyermekek kisgyermek istentisztelet család templomi szoktatás nevelés' },
        { title: 'Házasságkötés', page: 'Közérdekű Információk', url: 'informaciok.html#hazassag',
          keywords: 'házasság házasságkötés esküvő eskü házasulandók áldás templom' },
        { title: 'Temetés', page: 'Közérdekű Információk', url: 'informaciok.html#temetes',
          keywords: 'temetés elhalálozás elhunyt gyász temető nyugalom vigasztalás tartozás hátralék' },

        // Egyházközség
        { title: 'Adatok', page: 'Egyházközség', url: 'egyhazkozseg.html',
          keywords: 'adatok egyháztagok lélekszám lelkipásztorok főgondnok titkárnő bekő istván márton berde bethlenfalva kadicsfalva segédlelkész beosztott lelkész' },
        { title: 'Történet', page: 'Egyházközség', url: 'egyhazkozseg.html',
          keywords: 'történet történelem imaház templom építés szentelés harang harangláb csiha kálmán dietenheim reformáció parókia gyülekezeti ház' },
        { title: 'Testvérgyülekezetek', page: 'Egyházközség', url: 'egyhazkozseg.html',
          keywords: 'testvérgyülekezet dietenheim ulm budapest soroksár nagyszeben németország magyarország' },
        { title: 'Presbitérium és munkatársak', page: 'Egyházközség', url: 'egyhazkozseg.html',
          keywords: 'presbitérium presbiterek munkatársak gondozók kórus karnagy boros beáta póttagok' },

        // Gyülekezeti Alkalmak
        { title: 'Gyülekezeti alkalmak', page: 'Gyülekezeti Alkalmak', url: 'alkalmak.html',
          keywords: 'istentisztelet istentiszteletek bibliaóra vallásóra káté óra ike dalárda kórus nőszövetség karácsony húsvét pünkösd időpont vasárnap alkalmak program' },

        // Igehirdetések
        { title: 'Igehirdetések', page: 'Igehirdetések', url: 'igehirdetesek.html',
          keywords: 'igehirdetés igehirdetések prédikáció spotify podcast hanganyag élő közvetítés facebook istentisztelet videó' },

        // Linkek
        { title: 'Hasznos Linkek', page: 'Linkek', url: 'linkek.html',
          keywords: 'linkek hivatkozás egyházkerület református egyház biblia károli heidelbergi káté kánon facebook belváros szombatfalva bibliatársulat' }
    ];

    // Remove Hungarian accents so "temetes" matches "temetés", etc.
    function normalize(str) {
        return (str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    // Pre-compute a normalized haystack for each entry.
    INDEX.forEach(function (item) {
        item._haystack = normalize(item.title + ' ' + item.page + ' ' + item.keywords);
    });

    function search(query) {
        const terms = normalize(query).split(/\s+/).filter(Boolean);
        if (!terms.length) return [];

        return INDEX
            .map(function (item) {
                let score = 0;
                for (const term of terms) {
                    if (item._haystack.indexOf(term) === -1) return null; // all terms must match
                    score += 1;
                    if (normalize(item.title).indexOf(term) !== -1) score += 2; // title matches rank higher
                }
                return { item: item, score: score };
            })
            .filter(Boolean)
            .sort(function (a, b) { return b.score - a.score; })
            .slice(0, 8)
            .map(function (r) { return r.item; });
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    let activeIndex = -1;

    function renderResults(matches) {
        activeIndex = -1;
        if (!matches.length) {
            resultsBox.innerHTML = '<li class="search-no-results">Nincs találat.</li>';
            resultsBox.hidden = false;
            return;
        }
        resultsBox.innerHTML = matches.map(function (m) {
            return '<li role="option">' +
                '<a href="' + escapeHtml(m.url) + '">' +
                '<span class="search-result-title">' + escapeHtml(m.title) + '</span>' +
                '<span class="search-result-page">' + escapeHtml(m.page) + '</span>' +
                '</a></li>';
        }).join('');
        resultsBox.hidden = false;
    }

    function hideResults() {
        resultsBox.hidden = true;
        activeIndex = -1;
    }

    function currentLinks() {
        return Array.prototype.slice.call(resultsBox.querySelectorAll('a'));
    }

    function updateActive(links) {
        links.forEach(function (a, i) {
            a.classList.toggle('is-active', i === activeIndex);
        });
        if (activeIndex >= 0 && links[activeIndex]) {
            links[activeIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    input.addEventListener('input', function () {
        const q = input.value.trim();
        if (!q) { hideResults(); return; }
        renderResults(search(q));
    });

    input.addEventListener('keydown', function (e) {
        const links = currentLinks();
        if (resultsBox.hidden || !links.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % links.length;
            updateActive(links);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + links.length) % links.length;
            updateActive(links);
        } else if (e.key === 'Escape') {
            hideResults();
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const links = currentLinks();
        if (!links.length) return;
        const target = activeIndex >= 0 ? links[activeIndex] : links[0];
        if (target) window.location.href = target.getAttribute('href');
    });

    // Close the dropdown when clicking outside the search widget.
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.site-search')) hideResults();
    });
});
